import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    discount: { type: Number, default: 0 },
    price: { type: Number },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);


var targetExamForClass = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
    },
    targetExam: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timeseries: true }
);

const TargetExamForClass = mongoose.model(
  "TargetExamForClass",
  targetExamForClass
);
export { TargetExamForClass };
