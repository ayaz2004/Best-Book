import { Router } from "express";
import {
  placeOrder,
  getAllOrdersByUser,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = Router();
router.post("/placeorder", placeOrder);
// getting all orders by a user
router.get("/getordersbyuser/:userId", getAllOrdersByUser);

// admin
// getting all orders
router.get("/getallorders", getAllOrders);
export default router;
