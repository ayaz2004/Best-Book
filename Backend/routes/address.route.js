import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from "../controllers/address.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { Router } from "express";
const router = Router();

router.get("/getuseraddresses", verifyToken, getUserAddresses);
router.post("/addaddress", verifyToken, addAddress);
router.put("/updateaddress/:addressId", verifyToken, updateAddress);
router.delete("/deleteaddress/:addressId", verifyToken, deleteAddress);
export default router;
