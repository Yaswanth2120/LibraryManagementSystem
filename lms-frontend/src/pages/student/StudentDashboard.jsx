"use client"

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
  const token = localStorage.getItem("token")
  const userName = localStorage.getItem("userName")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, you might have an endpoint that returns these stats
        // For now, we'll simulate it with the requests data
        const res = await api.get("/borrow/my", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const pendingCount = res.data.filter((req) => req.status === "pending").length
        const approvedCount = res.data.filter((req) => req.status === "approved").length
        const rejectedCount = res.data.filter((req) => req.status === "rejected").length

        // Fetch books count
        const booksRes = await api.get("/books", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStats({
          totalBooks: booksRes.data.length,
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
          <span className="mr-2">🎓</span> {userName}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to LibriSys! Manage your book requests and explore our collection.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons for stats
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
          // Loading skeleton for recent activity
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
