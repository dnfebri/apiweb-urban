import User from "../models/UserModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async(req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Wrong Password!"});
    // req.session.userId = user.uuid; ////////////////
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const roleId = user.roleId;
    // const accessToken = jwt.sign({uuid, name, email, roleId}, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: '30s'
    // });
    const token = jwt.sign({uuid, name, email, roleId}, process.env.TOKEN_SECRET, {
      expiresIn: '1d'
    });
    req.session.token = token; 
    await User.update({
      token: token
    },{
      where: {
        id: user.id
      }
    })
    // res.cookie('Token', token, {
    //   httpOnly: true,
    //   // secure: true, // <<== jika menggunakan HTTPS
    //   maxAge: 24 * 60 * 60 * 1000
    // })
    // res.status(200).json({uuid, name, email, roleId});
    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const Me = async(req, res) => {;
  if (!req.session.token) {
    return res.status(401).json({msg: "Mohon login ke akun anda!"});
  }
  const user = await User.findOne({
    attributes:['uuid', 'name', 'email', 'roleId'],
    where: {
      // token: req.session.token
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemkan!"});
  res.status(200).json(user);
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
  req.session.destroy((err) => {
    if(err) return res.status(400).json({msg: "Tidak dapat Logout!"});
    res.status(200).json({msg: "Anda Berhasih Logout"});
  });
}