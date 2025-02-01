import { Router } from "express";
import {
  placeOrder,
  getAllOrdersByUser,
  getAllOrders,
  applyCoupon,
  addCoupon,
} from "../controllers/order.controller.js";

const router = Router();
router.post("/placeorder", placeOrder);
// getting all orders by a user
router.get("/getordersbyuser/:userId", getAllOrdersByUser);

// admin
// getting all orders
router.get("/getallorders", getAllOrders);
router.post("/applycoupon",applyCoupon);
router.post("/addcoupon",addCoupon);
export default router;
