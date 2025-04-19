// routes/bookRoutes.js

import express from 'express';
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📚 Public Route
router.get('/', getAllBooks);

// 🔐 Protected Routes (Admin/Librarian Only)
router.post('/', protect, authorize('admin', 'librarian'), addBook);
router.put('/:id', protect, authorize('admin', 'librarian'), updateBook);
router.delete('/:id', protect, authorize('admin', 'librarian'), deleteBook);

export default router;
