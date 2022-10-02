import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/Users.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/', verifyUser, adminOnly, getUsers);
router.get('/:id', verifyUser, getUserById);
router.post('/', verifyUser, createUser);
router.put('/:id', verifyUser, adminOnly, updateUser);
router.delete('/', verifyUser, adminOnly, deleteUser);

export default router;