import Reviews from "../models/reviews.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import mongoose from "mongoose";

export const addReview = async (req, res, next) => {
  const { username, description, rating, itemType, itemId } = req.body;
  if (
    [username, description, itemType, itemId].some(
      (feild) => feild?.trim() === ""
    ) ||
    !rating
  ) {
    next(errorHandler(400, "All fields are required."));
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    return next(errorHandler(404, `No user found with ID: ${username}`));
  }

  const Model = itemType === "Book" ? Book : "Quiz";
  const item = await Model.findById(itemId);
  if (!item) {
    return next(errorHandler(400, "no item is found"));
  }

  const newReview = new Reviews({
    username: username,
    description,
    rating,
    itemId,
    itemType,
  });

  try {
    await newReview.save();
    // item.reviewId = [...item.reviewId, newReview._id];
    // await item.save();
    res.status(200).send({
      success: true,
      message: "reviewAdded success fully",
      newReview,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// for admin
export const approveReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Reviews.findByIdAndUpdate(
      { _id: reviewId },
      { approved: true },
      { new: true }
    );
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    res.status(200).json({
      success: true,
      message: "Review approved successfully",
      review,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ approved: true });
    if (!reviews) {
      return next(errorHandler(404, "No reviews found"));
    }
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getApprovedReviewsForBook = async (req, res, next) => {
  const { bookId } = req.params;
  try {
    const reviews = await Reviews.find({ approved: true, itemId: bookId });
    if (!reviews) {
      return next(errorHandler(404, "No reviews found"));
    }
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getunApproveReviews = async (req, res, next) => {
  try {
    const reviews = await Reviews.find({ approved: false });
    if (!reviews) {
      return next(errorHandler(404, "No reviews found"));
    }
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const dataToUpdate = req.body;
  const review = await Reviews.findById(reviewId);

  if (!review) {
    return next(errorHandler(400, "no review found with passed id"));
  }

  try {
    Object.assign(review, dataToUpdate);
    await review.save();
    res.status(200).send({
      success: true,
      message: "review updated successfully",
      review,
    });
  } catch (error) {
    next(errorHandler(500, "Database error"));
  }
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return next(errorHandler(400, "Review ID is required"));
  }
  try {
    const review = await Reviews.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    // getting the model based on item type
    const Model = review.itemType === "Book" ? Book : "Quiz";

    const item = await Model.findById(review.itemId);
    if (!item) {
      return next(errorHandler(404, "Item not found"));
    }

    // removing the review id from the item reviewId array

    const deleteResponse = await Reviews.findByIdAndDelete(reviewId);
    if (!deleteResponse) {
      return next(errorHandler(404, "Review not found"));
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully ",
      deleteResponse,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getPopularReviews = async (req, res, next) => {
  try {
    // First check if any reviews exist
    const reviewCount = await Reviews.countDocuments({ isApproved: true });
    if (reviewCount === 0) {
      return res.status(200).json({
        success: true,
        reviews: [], // Return empty array instead of error
        message: "No reviews available yet",
      });
    }

    const popularReviews = await Reviews.aggregate([
      {
        $match: {
          isApproved: true,
          rating: { $exists: true, $ne: null }, // Ensure rating exists
        },
      },
      {
        $sort: {
          rating: -1,
          createdAt: -1, // Secondary sort by date
        },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 1,
          username: 1,
          description: 1,
          rating: 1,
          itemId: 1,
          itemType: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      reviews: popularReviews,
    });
  } catch (error) {
    console.error("Error fetching popular reviews:", error);
    return next(errorHandler(500, "Error fetching popular reviews"));
  }
};

export const getReview = async (req, res, next) => {
  const { bookId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return next(errorHandler(400, "Invalid book ID"));
  }

  try {
    const reviews = await Reviews.aggregate([
      {
        $match: {
          itemId: new mongoose.Types.ObjectId(bookId),
        },
      },
      {
        $group: {
          _id: "$itemId", // Group by book ID
          reviewsCount: { $sum: 1 }, // Count the number of reviews
          reviews: {
            $push: {
              reviewId: "$_id", // Review ID
              description: "$description", // Review description
              userId: "$username", // User ID
            },
          },
        },
      },
    ]);

    if (!reviews.length) {
      return next(errorHandler(404, "No reviews found for this book"));
    }

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews: reviews[0].reviews, // Array of reviews with required fields
      reviewsCount: reviews[0].reviewsCount, // Total count of reviews
    });
  } catch (error) {
    console.error(error.message);
    next(errorHandler(500, "Internal server error"));
  }
};
