import { Router } from "express";
import {
  placeOrder,
  getAllOrdersByUser,
  getAllOrders,
  applyCoupon,
  addCoupon,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();
router.post("/placeorder", verifyToken,placeOrder);
// getting all orders by a user
router.get("/getordersbyuser",verifyToken, getAllOrdersByUser);

// admin
// getting all orders
router.get("/getallorders", getAllOrders);
router.post("/applycoupon",applyCoupon);
router.post("/addcoupon",addCoupon);
export default router;
