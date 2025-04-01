import mongoose from "mongoose";

const quizSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure unique user-quiz combination
quizSubscriptionSchema.index({ userId: 1, quizId: 1 }, { unique: true });

export const QuizSubscription = mongoose.model(
  "QuizSubscription",
  quizSubscriptionSchema
);
