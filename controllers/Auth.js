import User from "../models/UserModel.js";
import argon2 from "argon2";
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
    const match = await argon2.verify(user.password, req.body.password);
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
      SameSite: 'Lax',
      // secure: false, // <<== jika menggunakan HTTPS
      maxAge: 24 * 60 * 60 * 1000
    })
    console.log(token);
    res.status(200).json({uuid, name, email, roleId, role, token});
    // res.status(200).json({token});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const Me = async(req, res) => {;
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
  // const uuid = user.uuid;
  // const name = user.name;
  // const email = user.email;
  // const roleId = user.roleId;
  // res.status(200).json({uuid, name, email, roleId});
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