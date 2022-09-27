import express from "express";
import UserRoute from "./UserRoute.js";
import RoleRoute from "./RoleRoute.js";

const router = express.Router();

router.use('/users', UserRoute);
router.use('/roles', RoleRoute);

export default router;