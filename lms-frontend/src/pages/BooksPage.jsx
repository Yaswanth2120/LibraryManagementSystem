"use client"

import { useEffect, useState, useCallback } from "react"
import api from "../services/api.js"
import useAuth from "../context/useAuth.js"

function BooksPage() {
  // Get user role from auth context
  const { token, user } = useAuth()
  const isAdmin = user?.role === "admin" || user?.role === "librarian"

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    availability: true,
  })
  const [editId, setEditId] = useState(null)
  const booksPerPage = 15

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBooks();
    } else {
      console.error("Token is missing. Please log in.");
      setLoading(false);
    }
  }, [token, fetchBooks]); // Add fetchBooks to dependencies
  

  // Search functionality
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate indexes for pagination
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  // Admin functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const payload = { ...form }
      if (editId) {
        await api.put(`/books/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await api.post("/books", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      setForm({ title: "", author: "", isbn: "", availability: true })
      setEditId(null)
      fetchBooks()
    } catch (err) {
      alert(err.response?.data?.message || "Error saving book")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return
    try {
      setLoading(true)
      await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchBooks()
    } catch (error) {
      console.error("Failed to delete book:", error)
      alert("Failed to delete book. Please try again.")
      setLoading(false)
    }
  }

  const handleEdit = (book) => {
    setEditId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      availability: book.availability,
    })
    // Scroll to form for better UX
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleCancel = () => {
    setEditId(null)
    setForm({ title: "", author: "", isbn: "", availability: true })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">📚</span> {isAdmin ? "Manage Books" : "Available Books"}
        </h1>

        {/* Search Bar */}
        <div className="w-full sm:w-auto sm:min-w-[300px] flex-grow sm:flex-grow-0 sm:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="w-full p-2 pl-8 border rounded shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Book Form - Only shown for admin/librarian */}
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4 transition-all mb-8"
        >
          <h2 className="font-semibold text-lg text-blue-700 dark:text-blue-400 border-b pb-2">
            {editId ? "Edit Book" : "Add New Book"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter book title"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Author
              </label>
              <input
                id="author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Enter author name"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ISBN
              </label>
              <input
                id="isbn"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                placeholder="Enter ISBN number"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                  className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 transition-all"
                />
                <span className="text-gray-700 dark:text-gray-300">Available for borrowing</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200 flex-grow sm:flex-grow-0 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : editId ? "Update Book" : "Add Book"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 px-4 rounded transition-colors duration-200 flex-grow sm:flex-grow-0 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Book Count and Pagination Info */}
      {!loading && (
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>
            Showing {currentBooks.length} of {filteredBooks.length} books
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          {totalPages > 0 && (
            <div className="mt-2 sm:mt-0">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      )}

      {/* Books Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
        </div>
      ) : (
        <div>
          {currentBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBooks.map((book) => (
                <div
                  key={book.id}
                  className="border p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <h2 className="font-semibold text-xl text-gray-900 dark:text-white mb-2 truncate" title={book.title}>
                    {book.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">Author:</span> {book.author}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                  <p className="mb-3">
                    <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>{" "}
                    <span className={`font-semibold ${book.availability ? "text-green-600" : "text-red-600"}`}>
                      {book.availability ? "Available" : "Unavailable"}
                    </span>
                  </p>

                  {/* Admin Actions - Only shown for admin/librarian */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleEdit(book)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex-1 transition-colors duration-200 flex items-center justify-center"
                      >
                        <span className="mr-1">✏️</span> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex-1 transition-colors duration-200 flex items-center justify-center"
                      >
                        <span className="mr-1">🗑️</span> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No books found</p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline mt-2"
                >
                  Clear search
                </button>
              ) : isAdmin ? (
                <p className="text-gray-500 dark:text-gray-400">Add your first book using the form above</p>
              ) : null}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                <span className="mr-1">←</span> Previous
              </button>

              <div className="hidden sm:flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                      ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                Next <span className="ml-1">→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BooksPage