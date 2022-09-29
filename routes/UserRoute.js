import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/Users.js";
// import { verifyToken } from "../middleware/VerifyToken.js";
import { verifyUser } from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/', verifyUser, getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/', deleteUser);

export default router;