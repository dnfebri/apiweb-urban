import express from "express";
import {
  getPersonalTrainings,
  getPersonalTrainingById,
  createPersonalTraining,
  updatePersonalTraining,
  deletePersonalTraining
} from "../controllers/PersonalTrainings.js"

const router = express.Router();

router.get('/', getPersonalTrainings);
router.get('/:id', getPersonalTrainingById);
router.post('/', createPersonalTraining);
router.put('/:id', updatePersonalTraining);
router.delete('/:id', deletePersonalTraining);

export default router;