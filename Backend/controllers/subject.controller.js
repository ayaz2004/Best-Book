import { Exam } from "../models/exam.model.js";
import { Subject } from "../models/subject.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
export const addSubject = async (req, res, next) => {
  try {
    const { name, examId } = req.body;

    // Validate input fields
    if (!name?.trim() || !examId?.trim()) {
      return next(errorHandler(400, "Please fill all the fields"));
    }

    // Check if the exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return next(errorHandler(404, "Exam not found"));
    }

    // Normalize the name (optional, e.g., lowercase and trim spaces)
    const normalizedName = name.trim().toLowerCase();

    // Check if the subject already exists
    const existingSubject = await Subject.findOne({
      name: normalizedName,
      exam: examId,
    });

    if (existingSubject) {
      return res.status(200).json({
        success: true,
        message: "Subject already exists",
        subject: existingSubject,
      });
    }

    // Create a new subject
    const subject = new Subject({
      name: normalizedName,
      exam: examId, // Reference to the exam
    });

    // Save the subject to the database
    await subject.save();

    // Send the response
    res.status(201).json({
      success: true,
      message: "Subject added successfully",
      subject, // Return the newly created subject
    });
  } catch (error) {
    console.error("Error adding subject:", error); // Log error for debugging
    next(errorHandler("An error occurred while adding the subject", 500));
  }
};
export const getAllSubjectsByExamId = async (req, res, next) => {
  const { examId } = req.params; // Use route params (or req.body/examId if needed)

  try {
    if (!examId) {
      return next(errorHandler(400, "Exam ID is required"));
    }
    console.log("exam id", examId);
    const subjects = await Subject.aggregate([
      {
        $match: {
          exam: new mongoose.Types.ObjectId(examId), // Match the exam field in the Subject collection
        },
      },
      {
        $lookup: {
          from: "exams", // Collection name for Exam
          localField: "exam", // Field in the Subject collection
          foreignField: "_id", // Field in the Exam collection
          as: "examDetails", // Output array field
        },
      },
    
    ]);

    if (!subjects.length) {
      return next(errorHandler(404, "No subjects found for the provided exam ID"));
    }

    res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error); // Log error for debugging
    next(errorHandler(500, "An error occurred while fetching subjects"));
  }
};
