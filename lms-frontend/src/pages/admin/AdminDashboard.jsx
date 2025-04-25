import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-700">🛠 Admin Dashboard</h1>
      <p className="text-gray-700">Welcome, Admin! What do you want to manage?</p>

      <div className="flex gap-4">
        <Link to="/admin/books">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">📚 Manage Books</button>
        </Link>
        {/* Future: Add a reports button */}
      </div>
    </div>
  );
}

export default AdminDashboard;
