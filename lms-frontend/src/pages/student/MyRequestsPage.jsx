
import { useEffect, useState, useCallback } from "react"
import api from "../../services/api.js"

function MyRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [filter, setFilter] = useState("all")

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchRequests = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await api.get("/borrow/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setError("");

      const userRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(userRes.data.name);
    } catch (err) {
      setError("Failed to load your requests. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleReturn = async (id) => {
    try {
      await api.put(`/borrow/${id}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Book returned!");
      fetchRequests(); // refresh
    } catch (err) {
      setMessage(err.response?.data?.message || "Return failed");
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);


  const filteredRequests = filter === "all" ? requests : requests.filter((req) => req.status === filter)

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">📥</span> Welcome, {userName || "Student"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track the status of your book borrow requests.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-600 dark:text-green-400">{message}</p>
        </div>
      )}

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === type
                ? `bg-${type === "pending" ? "yellow" : type === "approved" ? "green" : type === "rejected" ? "red" : "gray"}-500 text-white`
                : `bg-${type === "pending" ? "yellow" : type === "approved" ? "green" : type === "rejected" ? "red" : "gray"}-100 text-${type === "pending" ? "yellow" : type === "approved" ? "green" : type === "rejected" ? "red" : "gray"}-700 dark:bg-${type}-900/20 dark:text-${type}-400`
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No requests found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Title: {req.book?.title || `Book ID: ${req.bookId}`}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Request ID:</span> {req.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                  </p>

                  {req.status === "approved" && (
                    <button
                      onClick={() => handleReturn(req.id)}
                      className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Return
                    </button>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(req.status)}`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRequestsPage
