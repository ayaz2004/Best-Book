import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadImagesToCloudinary } from "../utils/cloudinary.js";

export const addQuiz = async (req, res, next) => {
  try {
    const {
      title,
      chapterId,
      questions: questionsJson,
      description,
      price,
      discountPrice,
      timeLimit,
      passingScore,
      isPublished,
    } = req.body;

    // Parse the JSON string if questions are sent as a string
    const questions =
      typeof questionsJson === "string"
        ? JSON.parse(questionsJson)
        : questionsJson;

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

    // Process price and discount
    const quizPrice = price !== undefined ? Number(price) : 0;
    let quizDiscountPrice =
      discountPrice !== undefined ? Number(discountPrice) : 0;

    // Ensure discount price doesn't exceed the original price
    if (quizDiscountPrice > quizPrice) {
      quizDiscountPrice = quizPrice;
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

      // Update other fields if provided
      if (description !== undefined) existingQuiz.description = description;
      if (price !== undefined) existingQuiz.price = quizPrice;
      if (discountPrice !== undefined)
        existingQuiz.discountPrice = quizDiscountPrice;
      if (timeLimit !== undefined) existingQuiz.timeLimit = Number(timeLimit);
      if (passingScore !== undefined)
        existingQuiz.passingScore = Number(passingScore);
      if (isPublished !== undefined)
        existingQuiz.isPublished = Boolean(isPublished);

      quiz = await existingQuiz.save(); // Save the updated quiz
      res
        .status(200)
        .json({ success: true, message: "Quiz updated successfully.", quiz });
    } else {
      // Create a new quiz
      quiz = new Quiz({
        title,
        chapterId,
        description: description || "",
        price: quizPrice,
        discountPrice: quizDiscountPrice,
        timeLimit: timeLimit || 30,
        passingScore: passingScore || 60,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : false,
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

export const getQuizById = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "chapterId",
      populate: {
        path: "subject",
        populate: {
          path: "exam",
        },
      },
    });

    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Calculate discount percentage if both price and discountPrice are set
    let discountPercentage = 0;
    if (
      quiz.price > 0 &&
      quiz.discountPrice > 0 &&
      quiz.discountPrice < quiz.price
    ) {
      discountPercentage = Math.round(
        ((quiz.price - quiz.discountPrice) / quiz.price) * 100
      );
    }

    // Format response with pricing information
    const quizDetails = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      chapterId: quiz.chapterId,
      price: quiz.price,
      discountPrice: quiz.discountPrice > 0 ? quiz.discountPrice : null,
      discountPercentage: discountPercentage,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      isPublished: quiz.isPublished,
      questionCount: quiz.questions.length,
      difficultyDistribution: getDifficultyDistribution(quiz.questions),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      isFree: quiz.price === 0,
      effectivePrice: quiz.discountPrice > 0 ? quiz.discountPrice : quiz.price,
    };

    res.status(200).json({
      success: true,
      quiz: quizDetails,
    });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    next(errorHandler(500, "Failed to fetch quiz details"));
  }
};

// Helper function to calculate difficulty distribution
function getDifficultyDistribution(questions) {
  if (!questions || questions.length === 0) return {};

  const distribution = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  questions.forEach((question) => {
    distribution[question.difficulty] =
      (distribution[question.difficulty] || 0) + 1;
  });

  // Convert to percentages
  const total = questions.length;
  return {
    Easy: Math.round((distribution.Easy / total) * 100) || 0,
    Medium: Math.round((distribution.Medium / total) * 100) || 0,
    Hard: Math.round((distribution.Hard / total) * 100) || 0,
  };
}
