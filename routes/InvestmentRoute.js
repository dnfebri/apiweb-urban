import express from "express"
import {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment
} from "../controllers/Investments.js"

const router = express.Router();

router.get('/', getInvestments);
router.get('/:id', getInvestmentById);
router.post('/', createInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

export default router;