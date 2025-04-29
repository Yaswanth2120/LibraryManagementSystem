"use client"

import { useEffect, useState } from "react"
import api from "../../services/api"
import useAuth from "../../context/useAuth.js"

function AdminBooksPage() {
  const { token } = useAuth()
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    availability: true,
  })
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const booksPerPage = 15

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const res = await api.get("/books")
      setBooks(res.data)
    } catch (error) {
      console.error("Failed to fetch books:", error)
      alert("Failed to load books. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Search and Pagination logic
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return
    try {
      setIsLoading(true)
      await api.delete(`/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchBooks()
    } catch (error) {
      console.error("Failed to delete book:", error)
      alert("Failed to delete book. Please try again.")
      setIsLoading(false)
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
    <div className="p-3 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center">
          <span className="mr-2">📚</span> Manage Books
        </h1>

        {/* Search Bar */}
        <div className="w-full sm:w-auto sm:min-w-[300px] flex-grow sm:flex-grow-0 sm:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="w-full p-2 pl-8 border rounded shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
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
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Book Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4 transition-all">
        <h2 className="font-semibold text-lg text-blue-700 border-b pb-2">{editId ? "Edit Book" : "Add New Book"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter book title"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              id="author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Enter author name"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              id="isbn"
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
              placeholder="Enter ISBN number"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
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
              <span className="text-gray-700">Available for borrowing</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200 flex-grow sm:flex-grow-0 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : editId ? "Update Book" : "Add Book"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 px-4 rounded transition-colors duration-200 flex-grow sm:flex-grow-0 shadow-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Book List */}
      {isLoading && !currentBooks.length ? (
        <div className="text-center py-8 text-gray-500">Loading books...</div>
      ) : (
        <>
          {/* Book Count and Pagination Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 mb-2">
            <div>
              Showing {currentBooks.length} of {filteredBooks.length} books
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            <div className="mt-2 sm:mt-0">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {/* Book Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {currentBooks.map((book) => (
              <div
                key={book.id}
                className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
              >
                <h2 className="font-semibold text-lg mb-2 text-blue-700 truncate" title={book.title}>
                  {book.title}
                </h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Author:</span> {book.author}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">ISBN:</span> {book.isbn}
                </p>
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`font-semibold ${book.availability ? "text-green-600" : "text-red-600"}`}>
                    {book.availability ? "Available" : "Borrowed"}
                  </span>
                </p>
                <div className="flex gap-2 mt-3">
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
              </div>
            ))}
          </div>

          {/* Empty States */}
          {currentBooks.length === 0 && !searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">No books found in the library</p>
              <p className="text-gray-400">Add your first book using the form above</p>
            </div>
          )}

          {currentBooks.length === 0 && searchTerm && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">No books match your search criteria</p>
              <button onClick={() => setSearchTerm("")} className="text-blue-500 hover:text-blue-700 underline mt-2">
                Clear search
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
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
                        currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                Next <span className="ml-1">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminBooksPage
