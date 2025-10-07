import express from "express";
import multer from "multer";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/UserController.js";
import { authenticate } from "../middleware/Auth.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);

export default router;
