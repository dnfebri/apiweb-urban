import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.uuid) {
    return res.status(403).json({msg: "Verify Token gagal!"});
  }
  const user = await User.findOne({
    where: {
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
  req.userId = user.id;
  req.role = user.role;
  next();
}

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.userId
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemkan!"});
  if(user.roleId > 2) return res.status(403).json({msg: "Akses di tolak"});
  next();
}