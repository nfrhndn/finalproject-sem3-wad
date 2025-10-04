import express from "express";
import {
  addToCart,
  getCart,
  deleteCartItem,
  clearCart,
  checkoutCart,
  updateCartItem,
} from "../controllers/CartController.js";
const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:id", deleteCartItem);
router.post("/clear", clearCart);
router.post("/checkout", checkoutCart);
router.put("/:id", updateCartItem);

export default router;
