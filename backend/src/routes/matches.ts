import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createMatch,
  getMatches,
  getMatch,
  updateMatchStatus,
  getMatchesForOrder,
  getMatchesForOffer,
} from '../controllers/matchController.js';

const router = express.Router();

router.post('/', authenticate, createMatch);
router.get('/', authenticate, getMatches);
router.get('/order/:orderId', getMatchesForOrder);
router.get('/offer/:offerId', getMatchesForOffer);
router.get('/:id', getMatch);
router.put('/:id/status', authenticate, updateMatchStatus);

export default router;

