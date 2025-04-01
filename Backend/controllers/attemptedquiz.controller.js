import { QuizAttempt } from "../models/quizattempted.model.js";
import { Quiz } from "../models/quiz.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Start a new quiz attempt
export const startQuizAttempt = async (req, res, next) => {
  try {
    const { quizId } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware setting req.user

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    // Check if the quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Check if user has an in-progress attempt
    const existingAttempt = await QuizAttempt.findOne({
      userId,
      quizId,
      status: "in-progress",
    });

    if (existingAttempt) {
      return res.status(200).json({
        success: true,
        message: "Continuing existing quiz attempt",
        attemptId: existingAttempt._id,
        attempt: existingAttempt,
        timeLimit: quiz.timeLimit,
      });
    }

    // Create a new attempt
    const newAttempt = new QuizAttempt({
      userId,
      quizId,
      totalQuestions: quiz.questions.length,
      startTime: new Date(),
      answers: quiz.questions.map((q) => ({
        questionId: q._id,
        selectedOption: null,
        isCorrect: false,
      })),
    });

    await newAttempt.save();

    res.status(201).json({
      success: true,
      message: "Quiz attempt started successfully",
      attemptId: newAttempt._id,
      attempt: newAttempt,
      timeLimit: quiz.timeLimit,
    });
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    next(errorHandler(500, "Failed to start quiz attempt"));
  }
};

// Submit answers for a quiz attempt
export const submitAnswer = async (req, res, next) => {
  try {
    const { attemptId, questionId, selectedOption } = req.body;
    const userId = req.user.id;

    if (!attemptId || !questionId || selectedOption === undefined) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Find the attempt
    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return next(errorHandler(404, "Quiz attempt not found"));
    }

    // Verify this is the user's attempt
    if (attempt.userId.toString() !== userId) {
      return next(errorHandler(403, "Unauthorized access to quiz attempt"));
    }

    // Check if attempt is still in progress
    if (attempt.status !== "in-progress") {
      return next(errorHandler(400, "This quiz attempt is already completed"));
    }

    // Find the quiz to check correct answers
    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Find the question in the quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
      return next(errorHandler(404, "Question not found in this quiz"));
    }

    // Find the correct option
    const correctOption = question.options.find((opt) => opt.isCorrect);
    const isCorrect = selectedOption === correctOption.text;

    // Update the answer in the attempt
    const answerIndex = attempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId
    );

    if (answerIndex === -1) {
      attempt.answers.push({
        questionId,
        selectedOption,
        isCorrect,
      });
    } else {
      attempt.answers[answerIndex].selectedOption = selectedOption;
      attempt.answers[answerIndex].isCorrect = isCorrect;
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    next(errorHandler(500, "Failed to submit answer"));
  }
};

// Complete a quiz attempt
export const completeQuizAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.body;
    const userId = req.user.id;

    if (!attemptId) {
      return next(errorHandler(400, "Attempt ID is required"));
    }

    // Find the attempt
    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return next(errorHandler(404, "Quiz attempt not found"));
    }

    // Verify this is the user's attempt
    if (attempt.userId.toString() !== userId) {
      return next(errorHandler(403, "Unauthorized access to quiz attempt"));
    }

    // Check if attempt is still in progress
    if (attempt.status !== "in-progress") {
      return next(errorHandler(400, "This quiz attempt is already completed"));
    }

    // Calculate score
    const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;
    const score = (correctAnswers / attempt.totalQuestions) * 100;

    // Update attempt
    attempt.status = "completed";
    attempt.endTime = new Date();
    attempt.timeSpent = Math.floor(
      (attempt.endTime - attempt.startTime) / 1000
    ); // in seconds
    attempt.score = score;
    attempt.correctAnswers = correctAnswers;

    await attempt.save();

    // Get the quiz to check if user passed
    const quiz = await Quiz.findById(attempt.quizId);
    const passed = score >= quiz.passingScore;

    res.status(200).json({
      success: true,
      message: "Quiz attempt completed successfully",
      attempt: {
        score,
        correctAnswers,
        totalQuestions: attempt.totalQuestions,
        timeSpent: attempt.timeSpent,
        passed,
      },
    });
  } catch (error) {
    console.error("Error completing quiz attempt:", error);
    next(errorHandler(500, "Failed to complete quiz attempt"));
  }
};

// Get user's attempt history for a quiz
export const getAttemptHistory = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    const attempts = await QuizAttempt.find({
      userId,
      quizId,
      status: "completed",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attempts: attempts.map((attempt) => ({
        attemptId: attempt._id,
        score: attempt.score,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.totalQuestions,
        timeSpent: attempt.timeSpent,
        date: attempt.endTime,
      })),
    });
  } catch (error) {
    console.error("Error fetching attempt history:", error);
    next(errorHandler(500, "Failed to fetch attempt history"));
  }
};

// Get details for a specific attempt
export const getAttemptDetails = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    if (!attemptId) {
      return next(errorHandler(400, "Attempt ID is required"));
    }

    const attempt = await QuizAttempt.findById(attemptId).populate({
      path: "quizId",
      select: "title questions passingScore timeLimit",
    });

    if (!attempt) {
      return next(errorHandler(404, "Attempt not found"));
    }

    // Verify this is the user's attempt
    if (attempt.userId.toString() !== userId) {
      return next(errorHandler(403, "Unauthorized access to quiz attempt"));
    }

    // Format response with detailed information
    const detailedAttempt = {
      attemptId: attempt._id,
      quiz: {
        id: attempt.quizId._id,
        title: attempt.quizId.title,
        passingScore: attempt.quizId.passingScore,
      },
      score: attempt.score,
      status: attempt.status,
      startTime: attempt.startTime,
      endTime: attempt.endTime,
      timeSpent: attempt.timeSpent,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      answers: attempt.answers.map((answer) => {
        const question = attempt.quizId.questions.id(answer.questionId);
        return {
          questionId: answer.questionId,
          question: question ? question.text : "Question not found",
          selectedOption: answer.selectedOption,
          isCorrect: answer.isCorrect,
          explanation: question ? question.explanation : null,
        };
      }),
    };

    res.status(200).json({
      success: true,
      attempt: detailedAttempt,
    });
  } catch (error) {
    console.error("Error fetching attempt details:", error);
    next(errorHandler(500, "Failed to fetch attempt details"));
  }
};
