// controllers/borrowController.js
import db from '../models/index.js';

const BorrowRequest = db.BorrowRequest;
const Book = db.Book;
const User = db.User;

// 🔽 GET /api/borrow/my — Student: view their own requests
export const getMyBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Book, as: 'Book', attributes: ['title', 'isbn'] },
        { model: User, as: 'User', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch your borrow requests',
      details: err.message,
    });
  }
};

// ➕ POST /api/borrow — Student: create a borrow request
export const createBorrowRequest = async (req, res) => {
  const { bookId } = req.body;

  try {
    const existingRequest = await BorrowRequest.findOne({
      where: {
        userId: req.user.id,
        bookId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request for this book' });
    }

    const newRequest = await BorrowRequest.create({
      userId: req.user.id,
      bookId,
      status: 'pending',
    });

    const createdRequest = await BorrowRequest.findByPk(newRequest.id, {
      include: [
        { model: Book, as: 'Book', attributes: ['title'] },
        { model: User, as: 'User', attributes: ['name'] }
      ],
    });

    res.status(201).json(createdRequest);

  } catch (err) {
    res.status(500).json({
      error: 'Failed to create borrow request',
      details: err.message,
    });
  }
};

// ✅ PUT /api/borrow/:id/status — Librarian/Admin approve/reject
export const updateBorrowStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await BorrowRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Borrow request not found' });
    }

    request.status = status;
    await request.save();

    if (status === 'approved') {
      const book = await Book.findByPk(request.bookId);
      if (book) {
        book.availability = false;
        await book.save();
      }
    }

    const updatedRequest = await request.reload({
      include: [
        { model: Book, as: 'Book', attributes: ['title'] },
        { model: User, as: 'User', attributes: ['name'] }
      ],
    });

    res.json({
      message: `Request ${status} successfully`,
      request: updatedRequest,
    });

  } catch (err) {
    res.status(500).json({
      error: 'Failed to update request status',
      details: err.message,
    });
  }
};

// 🔄 PUT /api/borrow/:id/return — Student returns book
export const returnBorrowedBook = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await BorrowRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({ error: 'Borrow request not found' });
    }

    if (request.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to return this book' });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved books can be returned' });
    }

    request.status = 'returned';
    await request.save();

    const book = await Book.findByPk(request.bookId);
    if (book) {
      book.availability = true;
      await book.save();
    }

    const returnedRequest = await request.reload({
      include: [
        { model: Book, as: 'Book', attributes: ['title'] },
        { model: User, as: 'User', attributes: ['name'] }
      ],
    });

    res.json({
      message: 'Book returned successfully',
      request: returnedRequest,
    });

  } catch (err) {
    res.status(500).json({
      error: 'Failed to return book',
      details: err.message,
    });
  }
};

// 📢 NEW: GET /api/borrow/all — Librarian/Admin view all requests
export const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.findAll({
      include: [
        { model: Book, as: 'Book', attributes: ['title', 'isbn'] },
        { model: User, as: 'User', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch all borrow requests',
      details: err.message,
    });
  }
};
