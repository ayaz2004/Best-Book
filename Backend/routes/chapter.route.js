import { Router } from "express";
import { addChapter, getChaptersBySubjectId } from "../controllers/chapter.controller.js";
const router = Router();

router.post("/addchapter", addChapter);
router.get("/getchapters/:subjectId", getChaptersBySubjectId);
export default router