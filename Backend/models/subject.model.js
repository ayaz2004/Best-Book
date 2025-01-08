import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
    {
      name: { type: String, required: true,lowercase: true },
      exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    },
    { timestamps: true }
  );
  export const Subject = mongoose.model("Subject", subjectSchema);