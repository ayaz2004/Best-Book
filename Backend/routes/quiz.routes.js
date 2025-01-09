import { Router } from "express";
import {
  addQuiz,
  deleteQuiz,
  getQuizbyChapterId,
} from "../controllers/quiz.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();
router.post(
  "/addquiz",
  upload.fields([
    {
      name: "questionFigure",
      maxCount: 1,
      
    },
    {
      name: "answerFigure",
      maxCount: 1,
    },
  ]),
  addQuiz
);
router.get("/getquizbyid/:chapterId", getQuizbyChapterId);
router.delete("/deletequiz/:quizId", deleteQuiz);
export default router;
