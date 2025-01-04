import { Router } from "express";
import { addReview, deleteReview, updateReview } from "../controllers/reviews.controllers.js";

const router = Router();
// user add review
router.post("/addreviews", addReview);
// user update review
router.put("/updatereviews/:reviewsId", updateReview);
// user delete review
router.delete("/deletereviews/:reviewsId", deleteReview);
export default router;
