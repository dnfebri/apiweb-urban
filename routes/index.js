import express from "express";
import AuthRoute from "./AuthRoute.js";
import UserRoute from "./UserRoute.js";
import RoleRoute from "./RoleRoute.js";
import { verifySession } from "../middleware/Verify.js";
import PersonalTrainingRoute from "./PersonalTrainingRoute.js";
import FotoKelasRoute from "./FotoKelasRoute.js";
import SuccessStoryRoute from "./SuccessStoryRoute.js";

const router = express.Router();

router.get('/', (reg, res) => {
  res.render('index', { title: 'Urban' });
});

router.use('/auth', AuthRoute);
router.use('/users', verifySession, UserRoute);
router.use('/roles', verifySession, RoleRoute);
router.use('/personal_training', PersonalTrainingRoute);
router.use('/foto_kelas', FotoKelasRoute);
router.use('/success_story', SuccessStoryRoute);

export default router;