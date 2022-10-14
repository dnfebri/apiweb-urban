import express from "express";
import AuthRoute from "./AuthRoute.js";
import UserRoute from "./UserRoute.js";
import RoleRoute from "./RoleRoute.js";
import { verifySession } from "../middleware/Verify.js";
import PersonalTrainingRoute from "./PersonalTrainingRoute.js";

const router = express.Router();

router.get('/', (reg, res) => {
  res.render('index', { title: 'Urban' });
});

router.use('/auth', AuthRoute);
router.use('/users', verifySession, UserRoute);
router.use('/roles', verifySession, RoleRoute);
router.use('/personal_training', PersonalTrainingRoute);

export default router;