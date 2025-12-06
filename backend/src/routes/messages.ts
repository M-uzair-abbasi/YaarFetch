import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  sendMessage,
  getMessages,
} from '../controllers/messageController';

const router = express.Router();

router.post('/', authenticate, sendMessage);
router.get('/match/:matchId', authenticate, getMessages);

export default router;

