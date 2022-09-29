import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  // if (!req.session.token) {
  //   return res.status(401).json({msg: "Mohon login ke akun anda!"});
  // }
  const user = await User.findOne({
    where: {
      uuid: req.uuid
    }
  });
  if(!user) return res.status(404).json({msg: "User tidak ditemkan!"});
  req.userId = user.id;
  req.role = user.role;
  next();
}