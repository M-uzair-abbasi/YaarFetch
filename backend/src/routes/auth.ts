import express from 'express';
import { register, login, verifyEmail, resendVerification } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

export default router;

