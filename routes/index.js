import express from "express";
import AuthRoute from "./AuthRoute.js";
import UserRoute from "./UserRoute.js";
import RoleRoute from "./RoleRoute.js";
import { verifyToken } from "../middleware/Verify.js";

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/users', verifyToken, UserRoute);
router.use('/roles', RoleRoute);

export default router;