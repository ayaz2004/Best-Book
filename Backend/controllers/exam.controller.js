import { Exam } from "../models/exam.model.js";
import { errorHandler } from "../utils/error.js";
import { TargetExamForClass } from "../models/exam.model.js"

export const addExam = async (req, res, next) => {
  try {
    let { name,description,discount,price } = req.body;

    // Ensure the name is present
    if (!name) {
      return next(errorHandler(400, "All fields are required."));
    }

    if(!description){ description = "";}
    if(!discount){ discount = 0;}
    if(!price){
      return next(errorHandler(400, "Price is required."));
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
      success:true,
      message: "Exam Added Successfully",
      exam: examResponse, // Ensure you're returning the correct ID
    });
  } catch (error) {
    console.error("Error saving exam:", error); // Log detailed error
    next(errorHandler(500, "Database error"));
  }
};



export const updateExam = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const updatedExamData = req.body;
    const exam = await Exam.findById(examId);

    if (!exam) {
      return next(errorHandler(400, "no exam found with passed id"));
    }

    Object.assign(exam, updatedExamData);
    await exam.save();
    res.status(200).send({
      success:true,
      message: "Exam Updated Successfully",
      exam,
    });
  } catch (error) {
    next(errorHandler(500, "Database error"));
  }
};


export const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    res.status(200).send({
      success:true,
      message: "All Exams",
      exams,
    });
  } catch (error) {
    next(errorHandler(500, "Database error"));
  }
}

export const getExamById = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) {
      return next(errorHandler(400, "no exam found with passed id"));
    }
    res.status(200).send({
      success:true,
      message: "Exam",
      exam,
    });
  } catch (error) {
    next(errorHandler(500, "Database error"));
  }
}

export const addOrUpdateTargetExamForClass = async (req, res, next) => {
  try {
    const { class: className, targetExam } = req.body;

    if (!className || !targetExam || !Array.isArray(targetExam)) {
      return next(
        errorHandler(
          400,
          "All fields are required and targetExam must be an array."
        )
      );
    }

    // Check if a TargetExamForClass record exists for this class
    const existingTargetExam = await TargetExamForClass.findOne({
      class: className,
    });

    if (existingTargetExam) {
      // If a record exists, update it by adding new target exams
      existingTargetExam.targetExam = [...existingTargetExam.targetExam, ...targetExam];
      await existingTargetExam.save();
      res.status(200).send({
        success: true,
        message: "Target exams updated successfully",
        updatedTargetExamForClass: existingTargetExam,
      });
    } else {
      // If no record exists, create a new TargetExamForClass
      const newTargetExamForClass = new TargetExamForClass({
        class: className,
        targetExam,
      });
      await newTargetExamForClass.save();
      res.status(200).send({
        success: true,
        message: "Target exams added successfully",
        newTargetExamForClass,
      });
    }
  } catch (error) {
    next(errorHandler(500, error.message)); // Handle the error accordingly
  }
};


export const getTargetExamForClass = async (req, res, next) => {
  try {
    const allTargetExamsForClasses = await TargetExamForClass.find().select(
      "-__v " 
    );
    res.status(200).send({
      success: true,
      message: "All target exams for classes",
      allTargetExamsForClasses,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
}
