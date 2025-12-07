import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile, uploadProfilePic } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/profile/picture', authenticate, uploadProfilePic);

export default router;

