import { Quiz } from "../models/quiz.model.js";

export const addQuiz = async (req, res) => {
  try {
    const { title, price, chapterId, questions } = req.body;

    // Validate input
    if (!title || !price || !chapterId || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if a quiz with the same title exists
    const existingQuiz = await Quiz.findOne({ title: title });

    let quiz;
    if (existingQuiz) {
      // Update the existing quiz's questions array
      existingQuiz.questions.push(...questions); // Append new questions to existing ones
      quiz = await existingQuiz.save(); // Save the updated quiz
      res.status(200).json({ message: "Quiz updated successfully.", quiz });
    } else {
      // Create a new quiz
      quiz = new Quiz({ title, price, chapterId, questions });
      await quiz.save();
      res.status(201).json({ message: "Quiz created successfully.", quiz });
    }
  } catch (error) {
    console.error("Error creating/updating quiz:", error);
    res.status(500).json({ message: "Failed to process quiz.", error: error.message });
  }
};
