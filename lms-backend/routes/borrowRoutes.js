// routes/borrowRoutes.js
import express from 'express';
import {
  createBorrowRequest,
  getMyBorrowRequests,
  getAllBorrowRequests,
  updateBorrowStatus,
  returnBorrowedBook
} from '../controllers/borrowController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.post('/', protect, authorize('student'), createBorrowRequest);
router.get('/my', protect, authorize('student'), getMyBorrowRequests);
router.get('/all', protect, authorize('librarian', 'admin'), getAllBorrowRequests);
router.put('/:id/status', protect, authorize('librarian', 'admin'), updateBorrowStatus);
router.put('/:id/return', protect, authorize('student'), returnBorrowedBook);


export default router;
