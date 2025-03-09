import express from "express";
import { signup, signin, verifyOTP, resendOtp } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verifyotp", verifyOTP);
router.post("/resendotp", resendOtp);

export default router;
