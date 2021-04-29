import express from "express";
const router = express.Router();
import {
  getProducts,
  getTopRatedProduct,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);
router.route("/top").get(getTopRatedProduct);
router
  .route("/:id")
  .get(getProductByID)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);
export default router;
