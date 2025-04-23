// controllers/bookController.js

import db from '../models/index.js';
const Book = db.Book;

// GET all books (public)
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

// POST add a new book (admin/librarian only)
export const addBook = async (req, res) => {
  const { title, author, isbn } = req.body;

  try {
    const book = await Book.create({ title, author, isbn });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
};

// PUT update book (admin/librarian only)
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, availability } = req.body;

  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.availability = availability;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
};

// DELETE book (admin/librarian only)
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
};
