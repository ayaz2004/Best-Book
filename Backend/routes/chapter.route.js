import { Router } from "express";
import { addChapter } from "../controllers/chapter.controller.js";
const router = Router();

router.post("/addchapter", addChapter);
export default router