import { Router } from "express";
import {
  addQuiz,
  deleteQuiz,
  getQuizbyChapterId,
  getAllQuizzes,
  getPopularQuizzes,
  updateQuiz,
  toggleQuizPublishStatus,
  updateQuizQuestion,
  deleteQuizQuestion,
  getQuizStats,
} from "../controllers/quiz.controller.js";
import {
  startQuizAttempt,
  submitAnswer,
  completeQuizAttempt,
  getAttemptHistory,
  getAttemptDetails,
} from "../controllers/quizAttempted.controller.js";

import {
  subscribeToQuiz,
  getUserSubscribedQuizzes,
  checkQuizAccess,
  revokeQuizSubscription,
} from "../controllers/quizSubscribed.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

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

router.put("/update/:quizId", verifyToken, updateQuiz);
router.put("/toggle-publish/:quizId", verifyToken, toggleQuizPublishStatus);
router.put("/question/:quizId/:questionId", verifyToken, updateQuizQuestion);
router.delete("/question/:quizId/:questionId", verifyToken, deleteQuizQuestion);
router.get("/stats/:quizId", verifyToken, getQuizStats);

// Quiz attempt routes
router.post("/start", verifyToken, startQuizAttempt);
router.post("/submit-answer", verifyToken, submitAnswer);
router.post("/complete", verifyToken, completeQuizAttempt);
router.get("/history/:quizId", verifyToken, getAttemptHistory);
router.get("/details/:attemptId", verifyToken, getAttemptDetails);

// Quiz subscription routes
router.post("/subscribe", verifyToken, subscribeToQuiz);
router.get("/user-subscriptions", verifyToken, getUserSubscribedQuizzes);
router.get("/check-access/:quizId", verifyToken, checkQuizAccess);
router.put("/revoke/:subscriptionId", verifyToken, revokeQuizSubscription);

// General quiz routes
router.get("/getquizbyid/:chapterId", getQuizbyChapterId);
router.delete("/deletequiz/:quizId", verifyToken, deleteQuiz);
router.get("/getallquizzes", getAllQuizzes);
router.get("/popularQuizzes", getPopularQuizzes);

export default router;
