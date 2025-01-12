import { Router } from "express";
import {
  addChapter,
  getAllChapters,
  getChaptersBySubjectId,
} from "../controllers/chapter.controller.js";
const router = Router();

router.post("/addchapter", addChapter);
router.get("/getAllChapters", getAllChapters);
router.get("/getchapters/:subjectId", getChaptersBySubjectId);
export default router;
