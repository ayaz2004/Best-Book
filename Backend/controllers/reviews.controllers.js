import Reviews from "../models/reviews.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";
import mongoose from "mongoose";
export const addReview = async (req, res, next) => {
  const { userid, description, rating, itemType, itemId } = req.body;
  if (
    [userid, description, itemType, itemId].some(
      (feild) => feild?.trim() === ""
    ) ||
    !rating
  ) {
    next(errorHandler(400, "All fields are required."));
  }
  const user = await User.findById(userid);
  if (!user) {
    return next(errorHandler(404, `No user found with ID: ${userid}`));
  }

  const Model = itemType === "Book" ? Book : "Quiz";
  const item = await Model.findById(itemId);
  if (!item) {
    return next(errorHandler(400, "no item is found"));
  }

  const newReview = new Reviews({
    userid: userid,
    description,
    rating,
    itemId,
    itemType,
  });

  try {
    await newReview.save();
    // item.reviewsId = [...item.reviewsId, newReview._id];
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

export const updateReview = async (req, res, next) => {
  const { reviewsId } = req.params;
  const dataToUpdate = req.body;
  const review = await Reviews.findById(reviewsId);

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
  const { reviewsId } = req.params;
  if (!reviewsId) {
    return next(errorHandler(400, "Review ID is required"));
  }
  try {
    const review = await Reviews.findById(reviewsId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    // getting the model based on item type
    const Model = review.itemType === "Book" ? Book : "Quiz";

    const item = await Model.findById(review.itemId);
    if (!item) {
      return next(errorHandler(404, "Item not found"));
    }

    // removing the review id from the item reviewsId array
    item.reviewsId = item.reviewsId.filter((id) => id.toString() !== reviewsId);
    await item.save();
    const deleteResponse = await Reviews.findByIdAndDelete(reviewsId);
    if (!deleteResponse) {
      return next(errorHandler(404, "Review not found"));
    }
    res.status(200).json({
      success: true,
      message: "Review deleted successfully ",
      deleteResponse,
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, error.message));
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
              userId: "$userid", // User ID
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
