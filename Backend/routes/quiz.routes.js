import { Router } from "express";
import {
  addQuiz,
  deleteQuiz,
  getQuizbyChapterId,
  getAllQuizzes,
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
router.get("/getallquizzes", getAllQuizzes);
export default router;
