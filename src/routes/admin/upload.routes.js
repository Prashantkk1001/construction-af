import express from "express";
import multer from "multer";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/images",
  authMiddleware,
  upload.array("images", 10),
  (req, res) => {
    const urls = req.files.map(
      (file) => `/uploads/${file.filename}`
    );
    res.json({ urls });
  }
);

router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    res.json({ url: `/uploads/${req.file.filename}` });
  }
);

export default router;
 
