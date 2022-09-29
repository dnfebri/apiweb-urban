import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) => {
  try {
    const response = await User.findAll({
      attributes:['uuid', 'name', 'email', 'employeeId', 'roleId']
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const getUserById = async(req, res) => {
  try {
    const response = await User.findOne({
      attributes:['uuid', 'name', 'email', 'employeeId', 'roleId'],
      where: {
        uuid:req.params.id
      }
    });
    if(!response) return res.status(404).json({msg: "User tidak ditemukan"});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const createUser = async(req, res) => {
  const user = await User.findOne({
    where: {
      uuid:req.body.email
    }
  });
  if(user) return res.status(500).json({msg: "Email is Already Registered"});
  const {name, email, password, confPassword, roleId} = req.body;
  if(password !== confPassword) return res.status(400).json({msg: "Password dan confirm password tidak cocok"});
  const hashPassword = await argon2.hash(password);
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

export const updateUser = async(req, res) => {
  const user = await User.findOne({
    where: {
      uuid:req.params.id
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
  const {name, email, password, confPassword, employeeId, roleId} = req.body;
  if (user.email === email) return res.status(500).json({msg: "email sudah ada"});
  let hashPassword;
  if (password == "" || password === null){
    hashPassword = user.password
  } else {
    hashPassword = await argon2.hash(password);
  }
  if(password !== confPassword) return res.status(400).json({msg: "Password dan confirm password tidak cocok"});
  try {
    await User.update({
      name: name,
      email: email,
      password: hashPassword,
      employeeId: employeeId,
      roleId: roleId
    }, {
      where: {
        id: user.id
      }
    });
    res.status(200).json({msg: "User Updated"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

export const deleteUser = async(req, res) => {
  const user = await User.findOne({
    where: {
      uuid:req.body.id
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
  try {
    await User.destroy({
      where: {
        id: user.id
      }
    });
    res.status(200).json({msg: "User Deleted"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}