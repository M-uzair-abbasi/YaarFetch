import express from 'express';
import { authenticate } from '../middleware/auth';
import { getProfile, updateProfile, uploadProfilePic } from '../controllers/userController';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/profile/picture', authenticate, uploadProfilePic);

export default router;

