import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, lowercase: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  questionFig: { type: String },
  answerFig: { type: String },

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
    title: { type: String, required: true, lowercase: true },

    // chapterId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Chapter",
    //   required: true,
    // },
    price: { type: Number },
    discountPrice: { type: Number, default: 0 },
    questions: [questionSchema], // Embedded questions
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
