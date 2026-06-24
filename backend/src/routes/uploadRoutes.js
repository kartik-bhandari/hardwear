import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png, webp, gif)'));
    }
  },
});

router.post('/', requireAuth, requireAdmin, (req, res) => {
  upload.array('images', 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const hasConfig = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (!hasConfig) {
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      return res.status(400).json({ 
        message: 'Cloudinary credentials are not configured in the server .env file.' 
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'hardwear_products',
          });
          fs.unlinkSync(file.path);
          return result.secure_url;
        } catch (uploadErr) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw uploadErr;
        }
      });

      const urls = await Promise.all(uploadPromises);
      res.json({ urls });
    } catch (uploadErr) {
      res.status(500).json({ 
        message: `Failed to upload one or more images to Cloudinary: ${uploadErr.message}` 
      });
    }
  });
});

export default router;
