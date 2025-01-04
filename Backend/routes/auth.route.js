import express from "express";
import { signup, signin, verifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verifyotp", verifyOTP);

export default router;
