"use client"

import { useEffect, useState } from "react"
import api from "../../services/api.js"

function BorrowBooksPage() {
  const [books, setBooks] = useState([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success") // 'success' or 'error'
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const res = await api.get("/books")
        setBooks(res.data)
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setMessage("Failed to fetch books. Please try again.")
        setMessageType("error")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const handleRequest = async (bookId) => {
    try {
      await api.post(
        "/borrow",
        { bookId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setMessage("Borrow request sent successfully!")
      setMessageType("success")
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed")
      setMessageType("error")
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">📚</span> Borrow Books
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse our collection and request books you'd like to borrow.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 ${
            messageType === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          } rounded-lg`}
        >
          <p>{message}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse"
              >
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No books found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{book.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">Author:</span> {book.author}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.availability
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {book.availability ? "Available" : "Not Available"}
                </span>
                <button
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleRequest(book.id)}
                  disabled={!book.availability}
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BorrowBooksPage
