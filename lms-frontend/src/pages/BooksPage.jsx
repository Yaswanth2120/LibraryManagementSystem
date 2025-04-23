"use client"

import { useEffect, useState } from "react"
import api from "../services/api.js"

function BooksPage() {
  const [books, setBooks] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const res = await api.get("/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBooks(res.data)
        setError("")
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Failed to fetch books")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [token])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Books</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Browse our collection of books available in the library</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

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
              <h2 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">{book.title}</h2>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BooksPage
