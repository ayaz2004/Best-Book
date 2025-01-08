import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
  
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
