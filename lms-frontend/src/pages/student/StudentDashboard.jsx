import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api.js"

function StudentDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentRequests, setRecentRequests] = useState([])
  const [userName, setUserName] = useState("")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Fetch user's requests
        const res = await api.get("/borrow/my", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const pendingCount = res.data.filter((req) => req.status === "pending").length
        const approvedCount = res.data.filter((req) => req.status === "approved").length
        const rejectedCount = res.data.filter((req) => req.status === "rejected").length

        // For recent activity, show last 3 requests (most recent first)
        const sortedRequests = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setRecentRequests(sortedRequests.slice(0, 3))

        // Fetch books count (only available books)
        const booksRes = await api.get("/books", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const availableBooks = booksRes.data.filter((book) => book.availability).length

        // Fetch user name (if not in localStorage)
        let name = localStorage.getItem("userName")
        if (!name) {
          const userRes = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          name = userRes.data.name
          localStorage.setItem("userName", name)
        }
        setUserName(name)

        setStats({
          totalBooks: availableBooks,
          pendingRequests: pendingCount,
          approvedRequests: approvedCount,
          rejectedRequests: rejectedCount,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🎓</span> {userName || "Student"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to LibriSys! Manage your book requests and explore our collection.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Books</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBooks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.approvedRequests}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-red-500">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejectedRequests}</p>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/student/borrow">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="mr-2">📚</span> Borrow Books
            </button>
          </Link>
          <Link to="/student/requests">
            <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              <span className="mr-2">📥</span> View My Requests
            </button>
          </Link>
          <Link to="/books">
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              <span className="mr-2">🔍</span> Browse Catalog
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : recentRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentRequests.map((req) => (
              <li key={req.id} className="py-4 flex items-start">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <span className="text-xl">📚</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {req.Book?.title || `Book ID: ${req.bookId}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)} on{" "}
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600 dark:text-gray-400 text-center py-8">
            <p>Your activity feed will be displayed here.</p>
            <p className="text-sm mt-2">Check back later for updates!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
