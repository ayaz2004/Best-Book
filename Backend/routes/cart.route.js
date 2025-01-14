import { Router } from "express";
import {
    getCart,
    addOrUpdateCartItem,
    removeCartItem,
    applyCoupon,
    clearCart,
  } from "../controllers/cart.controller.js";
  import { verifyToken } from "../utils/verifyUser.js";
  const router = Router();
  router.get("/getcart", verifyToken, getCart);
  router.post("/add", verifyToken, addOrUpdateCartItem);
  router.post("/remove", verifyToken, removeCartItem);
  router.post("/apply-coupon", verifyToken, applyCoupon);
  router.post("/clear", verifyToken, clearCart);

  export default router;