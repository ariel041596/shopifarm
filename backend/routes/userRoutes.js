import express from "express";
const router = express.Router();
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/").post(registerUser).get(protect, isAdmin, getUsers);
router
  .route("/:id")
  .delete(protect, isAdmin, deleteUser)
  .get(protect, isAdmin, getUserByID)
  .put(protect, isAdmin, updateUser);

export default router;
