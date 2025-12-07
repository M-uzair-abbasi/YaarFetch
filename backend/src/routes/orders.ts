import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', getOrders);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', getOrder);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

export default router;

