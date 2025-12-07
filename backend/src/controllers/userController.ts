import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).single('profilePic');

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePic: true,
        campus: true,
        rolePreference: true,
        rating: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, campus, rolePreference } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(campus !== undefined && { campus }),
        ...(rolePreference && { rolePreference }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profilePic: true,
        campus: true,
        rolePreference: true,
        rating: true,
        emailVerified: true,
      },
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadProfilePic = async (req: AuthRequest, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const profilePicUrl = `/uploads/profiles/${req.file.filename}`;

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: { profilePic: profilePicUrl },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          profilePic: true,
          campus: true,
          rolePreference: true,
          rating: true,
          emailVerified: true,
        },
      });

      res.json(updatedUser);
    } catch (error: any) {
      console.error('Upload profile pic error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

