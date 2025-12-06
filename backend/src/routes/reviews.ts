import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createReview,
  getReviews,
  getReview,
} from '../controllers/reviewController';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/user/:userId', getReviews);
router.get('/:id', getReview);

export default router;

