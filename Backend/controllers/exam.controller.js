import { Exam } from "../models/exam.model.js";
import { errorhandler } from "../utils/error.js";
export const addExam = async (req, res, next) => {
  try {
    let { name,description,discount,price } = req.body;

    // Ensure the name is present
    if (!name) {
      return next(errorhandler(400, "All fields are required."));
    }

    if(!description){ description = "";}
    if(!discount){ discount = 0;}
    if(!price){
      return next(errorhandler(400, "Price is required."));
    }
    // Process the name to remove spaces and convert to lowercase
    name = name.replace(/\s+/g, "").toLowerCase(); // Remove spaces and convert to lowercase

    let examResponse;

    // Check if the exam already exists
    const exam = await Exam.findOne({ name });
    if (!exam) {
      // Create a new exam if it doesn't exist
      const newExam = new Exam({ name,description,discount,price });
      examResponse = await newExam.save(); // Save the new exam
    } else {
      // Use the existing exam
      examResponse = exam;
    }

    res.status(200).send({
      status:"true",
      message: "Exam Added Successfully",
      exam: examResponse, // Ensure you're returning the correct ID
    });
  } catch (error) {
    console.error("Error saving exam:", error); // Log detailed error
    next(errorhandler(500, "Database error"));
  }
};



export const updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const updatedExamData = req.body;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return next(errorhandler(400, "no exam found with passed id"));
    }

    Object.assign(exam, updatedExamData);
    await exam.save();
    res.status(200).send({
      message: "Exam Updated Successfully",
      exam,
    });
  } catch (error) {
    next(errorhandler(500, "Database error"));
  }
};


export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    res.status(200).send({
      message: "All Exams",
      exams,
    });
  } catch (error) {
    next(errorhandler(500, "Database error"));
  }
}

export const getExamById = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) {
      return next(errorhandler(400, "no exam found with passed id"));
    }
    res.status(200).send({
      message: "Exam",
      exam,
    });
  } catch (error) {
    next(errorhandler(500, "Database error"));
  }
}