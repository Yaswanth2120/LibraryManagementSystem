// controllers/borrowController.js
import db from '../models/index.js';

const BorrowRequest = db.BorrowRequest;
const Book = db.Book;

// 🔽 GET /api/borrow/my — Student: get their own requests
export const getMyBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll({
      where: { userId: req.user.id },
    });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch requests',
      error: err.message,
    });
  }
};

// ➕ POST /api/borrow — Student: create borrow request
export const createBorrowRequest = async (req, res) => {
  const { bookId } = req.body;

  try {
    // Check if a request already exists
    const existingRequest = await BorrowRequest.findOne({
      where: {
        userId: req.user.id,
        bookId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'You already have a pending request for this book' });
    }

    const newRequest = await BorrowRequest.create({
      userId: req.user.id,
      bookId,
      status: 'pending',
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to request book',
      error: err.message,
    });
  }
};

// 📥 GET /api/borrow/all — Librarian/Admin: view all requests
export const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch all requests',
      error: err.message,
    });
  }
};

// ✅ PUT /api/borrow/:id/status — Approve/Reject a request
export const updateBorrowStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const request = await BorrowRequest.findByPk(id);
    if (!request)
      return res.status(404).json({ message: 'Request not found' });

    // Update status
    request.status = status;
    await request.save();

    // If approved, mark book as unavailable
    if (status === 'approved') {
      const book = await Book.findByPk(request.bookId);
      if (book) {
        book.availability = false;
        await book.save();
      }
    }

    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({
      message: 'Update failed',
      error: err.message,
    });
  }
};

export const returnBorrowedBook = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await db.BorrowRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    if (request.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to return this book' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved books can be returned' });
    }

    // Update borrow request status
    request.status = 'returned';
    await request.save();

    // Make the book available again
    const book = await db.Book.findByPk(request.bookId);
    if (book) {
      book.availability = true;
      await book.save();
    }

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Return failed', error: err.message });
  }
};

