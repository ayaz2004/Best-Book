import express from "express";
import { signup, signin, verifyOTP } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", verifyToken, signin);
router.post("/verifyotp", verifyOTP);

export default router;
