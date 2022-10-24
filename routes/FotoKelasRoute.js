import express from "express";
import {
  getFotoKelases,
  getFotoKelasById,
  createFotoKelas,
  updateFotoKelas,
  deleteFotoKelas
} from "../controllers/FotoKelas.js"

const router = express.Router();

router.get('/', getFotoKelases);
router.get('/:id', getFotoKelasById);
router.post('/', createFotoKelas);
router.put('/:id', updateFotoKelas);
router.delete('/:id', deleteFotoKelas);

export default router;