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
  // remove userId from parameter when using req.user.id and from add cart
  router.get("/getcart/:userId", verifyToken, getCart);
  router.post("/add/:userId", verifyToken, addOrUpdateCartItem);
  router.post("/remove", verifyToken, removeCartItem);
  router.post("/apply-coupon", verifyToken, applyCoupon);
  router.post("/clear", verifyToken, clearCart);

  export default router;