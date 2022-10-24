import express from "express";
import {
  getSuccessStorys,
  getSuccessStoryById,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory
} from "../controllers/SuccessStory.js"

const router = express.Router();

router.get('/', getSuccessStorys);
router.get('/:id', getSuccessStoryById);
router.post('/', createSuccessStory);
router.put('/:id', updateSuccessStory);
router.delete('/:id', deleteSuccessStory);

export default router;