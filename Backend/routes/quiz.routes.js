
import { Router } from "express";
import { addQuiz } from "../controllers/quiz.controller.js";
const router = Router();
router.post("/addquiz", addQuiz);

export default router;