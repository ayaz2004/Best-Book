import { QuizSubscription } from "../models/quizsubscribed.model.js";
import { Quiz } from "../models/quiz.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Subscribe user to a quiz
export const subscribeToQuiz = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { quizId, paymentId, price } = req.body;
    const userId = req.user.id;

    if (!quizId || !paymentId) {
      return next(errorHandler(400, "Missing required fields"));
    }

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // Check if subscription already exists
    const existingSubscription = await QuizSubscription.findOne({
      userId,
      quizId,
    });
    if (existingSubscription && existingSubscription.isActive) {
      return next(errorHandler(400, "You are already subscribed to this quiz"));
    }

    // Get the actual price from the quiz if not provided
    const finalPrice = price || quiz.discountPrice || quiz.price;

    // Create subscription
    const subscription = new QuizSubscription({
      userId,
      quizId,
      paymentId,
      price: finalPrice,
      purchaseDate: new Date(),
      isActive: true,
    });

    await subscription.save({ session });

    // Update user's subscribedQuiz array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { subscribedQuiz: quizId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the quiz",
      subscription,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error subscribing to quiz:", error);
    next(errorHandler(500, "Failed to subscribe to quiz"));
  }
};

// Get all quizzes subscribed by user
export const getUserSubscribedQuizzes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all active subscriptions
    const subscriptions = await QuizSubscription.find({
      userId,
      isActive: true,
    }).populate({
      path: "quizId",
      select: "title description timeLimit passingScore questions",
      populate: {
        path: "chapterId",
        select: "name subject",
        populate: {
          path: "subject",
          select: "name",
        },
      },
    });

    const subscribedQuizzes = subscriptions.map((sub) => ({
      subscriptionId: sub._id,
      quiz: {
        id: sub.quizId._id,
        title: sub.quizId.title,
        description: sub.quizId.description,
        timeLimit: sub.quizId.timeLimit,
        passingScore: sub.quizId.passingScore,
        questionCount: sub.quizId.questions.length,
        chapterInfo: sub.quizId.chapterId
          ? {
              id: sub.quizId.chapterId._id,
              name: sub.quizId.chapterId.name,
              subject: sub.quizId.chapterId.subject
                ? {
                    id: sub.quizId.chapterId.subject._id,
                    name: sub.quizId.chapterId.subject.name,
                  }
                : null,
            }
          : null,
      },
      purchaseDate: sub.purchaseDate,
    }));

    res.status(200).json({
      success: true,
      subscribedQuizzes,
    });
  } catch (error) {
    console.error("Error fetching subscribed quizzes:", error);
    next(errorHandler(500, "Failed to fetch subscribed quizzes"));
  }
};

// Check if user has access to a quiz
export const checkQuizAccess = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    if (!quizId) {
      return next(errorHandler(400, "Quiz ID is required"));
    }

    // Check if user is subscribed
    const subscription = await QuizSubscription.findOne({
      userId,
      quizId,
      isActive: true,
    });

    // Get the quiz
    const quiz = await Quiz.findById(quizId).select("price isPublished");

    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    // If quiz is free or user is subscribed, grant access
    const hasAccess =
      quiz.price === 0 || subscription !== null || quiz.isPublished === false;

    res.status(200).json({
      success: true,
      hasAccess,
      subscriptionDetails: subscription
        ? {
            id: subscription._id,
            purchaseDate: subscription.purchaseDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking quiz access:", error);
    next(errorHandler(500, "Failed to check quiz access"));
  }
};

// Revoke quiz subscription
export const revokeQuizSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;

    // Admin check can be added here if needed
    const isAdmin = req.user.isAdmin;

    const subscription = await QuizSubscription.findById(subscriptionId);

    if (!subscription) {
      return next(errorHandler(404, "Subscription not found"));
    }

    // Only allow admin or the subscription owner to revoke
    if (!isAdmin && subscription.userId.toString() !== userId) {
      return next(
        errorHandler(403, "Unauthorized to revoke this subscription")
      );
    }

    // Deactivate subscription
    subscription.isActive = false;
    await subscription.save();

    // Remove from user's subscribedQuiz array
    await User.findByIdAndUpdate(subscription.userId, {
      $pull: { subscribedQuiz: subscription.quizId },
    });

    res.status(200).json({
      success: true,
      message: "Quiz subscription revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking subscription:", error);
    next(errorHandler(500, "Failed to revoke subscription"));
  }
};
