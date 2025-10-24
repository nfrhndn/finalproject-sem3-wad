import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/UserController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const uploadDir = "uploads/avatars";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${req.user?.id || "guest"}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(
      new Error("Format file tidak didukung (gunakan JPG/PNG/WEBP)"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);

export default router;
