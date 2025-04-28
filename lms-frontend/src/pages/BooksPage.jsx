"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this if using React Router
import api from "../services/api.js";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await api.get("/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(res.data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  const handleAddBook = () => {
    navigate("/add-book"); // Navigate to Add Book page
  };

  const handleEdit = (bookId) => {
    navigate(`/edit-book/${bookId}`); // Navigate to Edit Book page with bookId
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the book list
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete the book");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Books</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse our collection of books available in the library
        </p>
      </div>

      {/* Add Book Button for Admin/Librarian */}
      {(user?.role === "admin" || user?.role === "librarian") && (
        <div className="mb-6">
          <button
            onClick={handleAddBook}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add New Book
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                {book.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">Author:</span> {book.author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
              <div className="flex items-center mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.availability
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {book.availability ? "Available" : "Not Available"}
                </span>
              </div>

              {/* Edit/Delete buttons for Admin/Librarian */}
              {(user?.role === "admin" || user?.role === "librarian") && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(book.id)}
                    className="px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-4 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksPage;
