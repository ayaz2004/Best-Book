import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    discount: { type: Number, default: 0 },
    price: { type: Number, required: true },
  
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
