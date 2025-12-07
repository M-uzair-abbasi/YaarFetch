import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createReview,
  getReviews,
  getReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/user/:userId', getReviews);
router.get('/:id', getReview);

export default router;

