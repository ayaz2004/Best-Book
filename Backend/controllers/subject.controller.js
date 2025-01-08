import { Exam } from "../models/exam.model.js";
import { Subject } from "../models/subject.model.js";
import { errorhandler } from "../utils/error.js";
export const addSubject = async (req, res, next) => {
  try {
    const { name, examId } = req.body;

    // Validate input fields
    if (!name?.trim() || !examId?.trim()) {
      return next(errorhandler(400, "Please fill all the fields"));
    }

    // Check if the exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return next(errorhandler(404, "Exam not found"));
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
    next(errorhandler("An error occurred while adding the subject", 500));
  }
};
