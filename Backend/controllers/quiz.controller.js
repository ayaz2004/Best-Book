import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { errorHandler } from "../utils/error.js";
import { uploadImagesToCloudinary } from "../utils/cloudinary.js";

export const addQuiz = async (req, res, next) => {
  try {
    const { title,  chapterId, questions } = req.body;

  
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
      }
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
