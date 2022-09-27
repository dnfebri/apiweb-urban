import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/Users.js";
// import { verifyUser, adminOnly } from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/', deleteUser);

export default router;