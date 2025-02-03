import express from "express";
import {
  deleteUser,
  signout,
  test,
  updateUser,
  getAnalytics,
  fetchUserList,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.delete("/delete/:userid", verifyToken, deleteUser);
router.post("/signout", verifyToken, signout);
router.put("/update/:userid", verifyToken, updateUser);
router.get("/analytics", getAnalytics);
router.get("/userlist", fetchUserList);

export default router;
