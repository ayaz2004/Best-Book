import {
  getUserAddresses,
  addAddress,
  updateAddress
} from "../controllers/address.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { Router } from "express";
const router = Router();

router.get("/getuseraddresses", verifyToken, getUserAddresses);
router.post("/addaddress", verifyToken, addAddress);
router.put("/updateaddress/:addressId", verifyToken, updateAddress);
router.delete("/deleteaddress/:addressId", verifyToken, updateAddress);
export default router;
