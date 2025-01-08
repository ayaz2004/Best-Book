import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true,lowercase: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  explanation: { type: String },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  year: { type: Number },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true,lowercase: true },
    price: { type: Number, required: true },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    questions: [questionSchema], // Embedded questions
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
