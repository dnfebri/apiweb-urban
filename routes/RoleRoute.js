import express from "express";
import {
  getRoles,
  // getRoleById,
  createRole,
  updateRole
  // deleteRole
} from "../controllers/Roles.js";
// import { verifyRole, adminOnly } from "../middleware/AuthRole.js"

const router = express.Router();

router.get('/', getRoles);
// router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRole);
// router.delete('/', deleteRole);

export default router;