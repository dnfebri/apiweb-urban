import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Roles from "../models/RoleModel.js";

export const Login = async(req, res) => {
  try {
    const user = await User.findOne({
      // attributes:['uuid', 'name', 'email', 'roleId'],
      where: {
        email: req.body.email
      },
      include:({
        model: Roles,
        attributes:['name']
      })
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
    // const match = await argon2.verify(user.password, req.body.password);
    const match = await bcrypt.compareSync(req.body.password, user.password);
    if(!match) return res.status(400).json({msg: "Wrong Password!"});
    // req.session.userId = user.uuid; ////////////////
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const roleId = user.roleId;
    const role = user.role.name;
    // const accessToken = jwt.sign({uuid, name, email, roleId}, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: '30s'
    // });
    const token = jwt.sign({uuid, name, email, roleId, role}, process.env.TOKEN_SECRET, {
      expiresIn: '1d'
    });
    // req.session.token = token; 
    await User.update({
      token: token
    },{
      where: {
        id: user.id
      }
    })
    res.cookie('token', token, {
      httpOnly: true,
      SameSite: "none",
      secure: false, // <<== jika menggunakan HTTPS
      maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({uuid, name, email, roleId, role, token});
    // res.status(200).json({token});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const Register = async(req, res) => {
  const passwd = req.headers.passwdregister;
  console.log(req.headers.passwdregister);
  if (passwd !== process.env.PASSWD_REGISTER) return res.status(400).json({msg: "Registration Rejected"})
  const user = await User.findOne({
    where: {
      uuid:req.body.email
    }
  });
  if(user) return res.status(500).json({msg: "Email is Already Registered"});
  const {name, email, password, confPassword, roleId} = req.body;
  if(password !== confPassword) return res.status(400).json({msg: "Password dan confirm password tidak cocok"});
  // const hashPassword = await argon2.hash(password);
  const salt = bcrypt.genSaltSync();
  const hashPassword = await bcrypt.hashSync(password, salt);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      roleId: roleId
    });
    res.status(201).json({msg: "Register Berhasil"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const Me = async(req, res) => {
  if (!req.uuid) {
    return res.status(401).json({msg: "User tidak terdaftar!"});
  }
  const user = await User.findOne({
    attributes:['uuid', 'name', 'email', 'roleId', 'token'],
    where: {
      // token: req.session.token
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemkan!"});
  if(user.token != req.token) return res.status(401).json({msg: "Mohon login dahulu!"});
  return res.sendStatus(200);
}

export const logOut = async(req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
  await User.update({token: null}, {
    where: {
      id: user.id
    }
  });
  // req.session.destroy((err) => {
  //   if(err) return res.status(400).json({msg: "Tidak dapat Logout!"});
  //   res.status(200).json({msg: "Anda Berhasih Logout"});
  // });
  res.removeHeader('cookie');
  res.status(200).clearCookie('token').json({msg: "Anda Berhasih Logout"});
}