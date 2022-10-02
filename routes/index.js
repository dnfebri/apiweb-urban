import express from "express";
import AuthRoute from "./AuthRoute.js";
import UserRoute from "./UserRoute.js";
import RoleRoute from "./RoleRoute.js";
import { verifySession } from "../middleware/Verify.js";

const router = express.Router();

router.use('/auth', AuthRoute);
router.use('/users', verifySession, UserRoute);
router.use('/roles', verifySession, RoleRoute);

export default router;