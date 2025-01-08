import { Chapter } from "../models/chapter.model.js";
import { Subject } from "../models/subject.model.js";
import { errorhandler } from "../utils/error.js";

export const addChapter = async (req, res, next) => {
  try {
    const { name, subjectId } = req.body;

    // Validate input fields
    if (!name?.trim() || !subjectId?.trim()) {
      return next(errorhandler(400,"Please fill all the fields"));
    }

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return next(errorhandler(404,"Subject not found"));
    }

    // Normalize the name (optional, e.g., lowercase and trim spaces)
    const normalizedName = name.trim().toLowerCase();

    // Check if the chapter already exists for the subject
    const existingChapter = await Chapter.findOne({
      name: normalizedName,
      subject: subjectId,
    });

    if (existingChapter) {
      return res.status(200).json({
        success: true,
        message: "Chapter already exists",
        chapter: existingChapter,
      });
    }

    // Create a new chapter
    const chapter = new Chapter({
      name: normalizedName,
      subject: subjectId,
    });

    // Save the chapter to the database
    await chapter.save();

    res.status(201).json({
      success: true,
      message: "Chapter added successfully",
      chapter,
    });
  } catch (error) {
    console.error("Error adding chapter:", error); // Log error for debugging
    next(errorhandler("An error occurred while adding the chapter", 500));
  }
};
