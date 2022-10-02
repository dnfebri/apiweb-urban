import express from "express";
import {
  getRoles,
  // getRoleById,
  createRole,
  updateRole
  // deleteRole
} from "../controllers/Roles.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/', verifyUser, adminOnly, getRoles);
// router.get('/:id', getRoleById);
router.post('/', verifyUser, adminOnly, createRole);
router.put('/:id', verifyUser, adminOnly, updateRole);
// router.delete('/', deleteRole);

export default router;