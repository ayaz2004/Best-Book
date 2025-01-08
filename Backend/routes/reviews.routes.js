import { Router } from "express";
import { addReview, deleteReview, updateReview, getReview } from "../controllers/reviews.controllers.js";

const router = Router();
// user add review
router.post("/addreviews", addReview);
// user update review
router.put("/updatereviews/:reviewsId", updateReview);
// user delete review
router.delete("/deletereviews/:reviewsId", deleteReview);
// get review of particular book
router.get("/getreviews/:bookId", getReview);

export default router;
