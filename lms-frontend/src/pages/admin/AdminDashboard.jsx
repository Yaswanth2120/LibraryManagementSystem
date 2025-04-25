import { useEffect, useState } from 'react';
import api from '../../services/api';
import useAuth from '../../context/useAuth.js';

function AdminDashboard() {
  const { token } = useAuth();
  const { name } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
  🛠 {name}</h1>

    <p className="text-gray-600">Welcome to the Admin Dashboard. Manage your system with insights below.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-blue-500 shadow">
              <p className="text-sm text-gray-500">Total Books</p>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-green-500 shadow">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-500 shadow">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-3xl font-bold">{stats.totalRequests}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-indigo-500 shadow">
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-3xl font-bold">{stats.pendingRequests}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-green-600 shadow">
              <p className="text-sm text-gray-500">Approved Requests</p>
              <p className="text-3xl font-bold">{stats.approvedRequests}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-red-600 shadow">
              <p className="text-sm text-gray-500">Rejected Requests</p>
              <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
            </div>
          </>
        )}
      </div>

      {/* Quick Action */}
      <div className="mt-8">
        <a
          href="/admin/books"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          📚 Manage Books
        </a>
      </div>
    </div>
  );
}

export default AdminDashboard;
