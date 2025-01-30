import { Router } from "express";
import {
  addReview,
  deleteReview,
  updateReview,
  getReview,
  approveReview,
  getunApproveReviews,
  getApprovedReviews,
  getPopularReviews,
  getApprovedReviewsForBook
} from "../controllers/reviews.controllers.js";

const router = Router();
// user add review
router.post("/addreviews", addReview);
// user update review
router.put("/updatereviews/:reviewId", updateReview);
// user delete review
router.delete("/deletereviews/:reviewId", deleteReview);
// get review of particular book
router.get("/getreviews/:bookId", getReview);
// approve review
router.put("/approvereview/:reviewId", approveReview);
// unapprove review
router.get("/unapprovereview", getunApproveReviews);
// approve review
router.get("/approvereview", getApprovedReviews);
// get popular reviews
router.get("/popularreviews", getPopularReviews);
// get approved reviews for particular books
router.get("/approvedreviews/:bookId", getApprovedReviewsForBook);
export default router;
