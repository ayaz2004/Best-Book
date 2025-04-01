import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadImagesToCloudinary } from "../utils/cloudinary.js";

export const addQuiz = async (req, res, next) => {
  try {
    const { title, chapterId, questions } = req.body;

    // Validate input
    if (
      !title ||
      !chapterId ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields." });
    }

    // Process each question's figures (if provided)
    const processedQuestions = await Promise.all(
      questions.map(async (question) => {
        const questionFigPath = question?.questionFigPath || null;
        const answerFigPath = question?.answerFigPath || null;

        let questionFigureUrl = null;
        let answerFigureUrl = null;

        if (questionFigPath) {
          const uploadResult = await uploadImagesToCloudinary(
            questionFigPath,
            "quizzes/questions"
          );
          questionFigureUrl = uploadResult.secure_url;
        }

        if (answerFigPath) {
          const uploadResult = await uploadImagesToCloudinary(
            answerFigPath,
            "quizzes/answers"
          );
          answerFigureUrl = uploadResult.secure_url;
        }

        return {
          text: question.text,
          options: question.options,
          explanation: question.explanation,
          difficulty: question.difficulty,
          year: question.year,
          questionFig: questionFigureUrl,
          answerFig: answerFigureUrl,
        };
      })
    );

    // Check if a quiz with the same title exists
    const existingQuiz = await Quiz.findOne({ title });

    let quiz;
    if (existingQuiz) {
      // Update the existing quiz's questions array
      existingQuiz.questions.push(...processedQuestions); // Append new questions
      quiz = await existingQuiz.save(); // Save the updated quiz
      res
        .status(200)
        .json({ success: true, message: "Quiz updated successfully.", quiz });
    } else {
      // Create a new quiz
      quiz = new Quiz({
        title,
        chapterId,
        questions: processedQuestions,
      });
      await quiz.save();
      res
        .status(201)
        .json({ success: true, message: "Quiz created successfully.", quiz });
    }
  } catch (error) {
    console.error("Error creating/updating quiz:", error);
    next(errorHandler(400, "An error occurred while creating the quiz."));
  }
};

// New methods for admin functionality

export const updateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const {
      title,
      description,
      price,
      discountPrice,
      timeLimit,
      passingScore,
      isPublished,
    } = req.body;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Update quiz properties if provided
    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (price !== undefined) quiz.price = price;
    if (discountPrice !== undefined) quiz.discountPrice = discountPrice;
    if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
    if (passingScore !== undefined) quiz.passingScore = passingScore;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    next(errorHandler(500, "Failed to update quiz"));
  }
};

export const toggleQuizPublishStatus = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Toggle the publish status
    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: `Quiz ${
        quiz.isPublished ? "published" : "unpublished"
      } successfully`,
      isPublished: quiz.isPublished,
    });
  } catch (error) {
    console.error("Error toggling quiz publish status:", error);
    next(errorHandler(500, "Failed to update quiz publish status"));
  }
};

export const updateQuizQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    const updates = req.body;

    if (!quizId || !questionId) {
      return next(errorHandler(400, "Quiz ID and Question ID are required"));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Find the question in the quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
      return next(errorHandler(404, "Question not found in this quiz"));
    }

    // Update question properties if provided
    if (updates.text) question.text = updates.text;
    if (updates.options) question.options = updates.options;
    if (updates.explanation) question.explanation = updates.explanation;
    if (updates.difficulty) question.difficulty = updates.difficulty;
    if (updates.year) question.year = updates.year;

    // Process question figure if provided
    if (updates.questionFigPath) {
      const uploadResult = await uploadImagesToCloudinary(
        updates.questionFigPath,
        "quizzes/questions"
      );
      question.questionFig = uploadResult.secure_url;
    }

    // Process answer figure if provided
    if (updates.answerFigPath) {
      const uploadResult = await uploadImagesToCloudinary(
        updates.answerFigPath,
        "quizzes/answers"
      );
      question.answerFig = uploadResult.secure_url;
    }

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });
  } catch (error) {
    console.error("Error updating quiz question:", error);
    next(errorHandler(500, "Failed to update question"));
  }
};

export const deleteQuizQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;

    if (!quizId || !questionId) {
      return next(errorHandler(400, "Quiz ID and Question ID are required"));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Find and remove the question
    const questionIndex = quiz.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    if (questionIndex === -1) {
      return next(errorHandler(404, "Question not found in this quiz"));
    }

    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz question:", error);
    next(errorHandler(500, "Failed to delete question"));
  }
};

export const getQuizStats = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Get stats from QuizAttempt model - this would need to be adjusted based on your schema
    const attemptsStats = await mongoose.model("QuizAttempt").aggregate([
      { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          completedAttempts: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          avgScore: { $avg: "$score" },
          highestScore: { $max: "$score" },
          avgTimeSpent: { $avg: "$timeSpent" },
        },
      },
    ]);

    // Get subscription stats
    const subscriptionStats = await mongoose
      .model("QuizSubscription")
      .aggregate([
        { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
        {
          $group: {
            _id: null,
            totalSubscriptions: { $sum: 1 },
            activeSubscriptions: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
            },
            totalRevenue: { $sum: "$price" },
          },
        },
      ]);

    const stats = {
      quiz: {
        id: quiz._id,
        title: quiz.title,
        questionCount: quiz.questions.length,
        isPublished: quiz.isPublished,
      },
      attempts:
        attemptsStats.length > 0
          ? attemptsStats[0]
          : {
              totalAttempts: 0,
              completedAttempts: 0,
              avgScore: 0,
              highestScore: 0,
              avgTimeSpent: 0,
            },
      subscriptions:
        subscriptionStats.length > 0
          ? subscriptionStats[0]
          : {
              totalSubscriptions: 0,
              activeSubscriptions: 0,
              totalRevenue: 0,
            },
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    next(errorHandler(500, "Failed to fetch quiz statistics"));
  }
};

export const getQuizbyChapterId = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    if (!chapterId) {
      return next(errorHandler(400, "Please provide a chapter ID"));
    }

    const quizes = await Quiz.aggregate([
      {
        $match: {
          chapterId: new mongoose.Types.ObjectId(chapterId),
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapterId",
          foreignField: "_id",
          as: "quiz",
        },
      },
      {
        $unwind: "$quiz",
      },
      {
        $project: {
          title: 1,
          questions: 1,
        },
      },
    ]);

    if (!quizes || quizes.length === 0) {
      return next(
        errorHandler(404, "No quiz found for the provided chapter ID")
      );
    }

    res.status(200).json({
      success: true,
      quizes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    next(errorHandler(500, "Database error"));
  }
};

export const deleteQuiz = async (req, res, next) => {
  const { quizId } = req.params;
  if (!quizId) {
    return next(errorHandler(400, "Quiz ID is required"));
  }

  try {
    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, error.message));
  }
};

export const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate({
      path: "chapterId",
      populate: {
        path: "subject",
        populate: {
          path: "exam",
        },
      },
    });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    next(error);
  }
};

// Fetch popular quizzes (example: based on some criteria)
export const getPopularQuizzes = async (req, res, next) => {
  try {
    // Fetch quizzes sorted by some criteria as an example
    const quizzes = await Quiz.find()
      .populate({
        path: "chapterId",
        populate: {
          path: "subject",
          populate: {
            path: "exam",
          },
        },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Popular quizzes fetched successfully",
      quizzes,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
