import { Router } from "express";
import {
  placeOrder,
  getAllOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  applyCoupon,
  addCoupon,
  initiatePhonepePayment,
  phonepeStatusCallback,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();
router.post("/placeorder", verifyToken, placeOrder);

// getting all orders by a user
router.get("/getordersbyuser", verifyToken, getAllOrdersByUser);

// Route to initiate online payment via PhonePe
router.post("/create-payment", initiatePhonepePayment);

// Route for the PhonePe payment status callback
router.get("/payment-status", phonepeStatusCallback);

// admin
// getting all orders
router.get("/getallorders", getAllOrders);

router.put("/update-status", updateOrderStatus);

router.post("/applycoupon", verifyToken, applyCoupon);
router.post("/addcoupon", addCoupon);
export default router;
