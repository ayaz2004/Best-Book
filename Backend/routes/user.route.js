import express from "express";
import { deleteUser, test } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.delete("/delete/:userid", verifyToken, deleteUser);

export default router;
