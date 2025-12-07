import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  getMyOffers,
} from '../controllers/offerController.js';

const router = express.Router();

router.post('/', authenticate, createOffer);
router.get('/', getOffers);
router.get('/my-offers', authenticate, getMyOffers);
router.get('/:id', getOffer);
router.put('/:id', authenticate, updateOffer);
router.delete('/:id', authenticate, deleteOffer);

export default router;

