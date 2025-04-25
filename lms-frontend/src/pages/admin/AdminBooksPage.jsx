import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminBooksPage() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', isbn: '' });
  const [editId, setEditId] = useState(null);

  const fetchBooks = async () => {
    const res = await api.get('/books');
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/books/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/books', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: '', author: '', isbn: '' });
      setEditId(null);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await api.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  const handleEdit = (book) => {
    setEditId(book.id);
    setForm({ title: book.title, author: book.author, isbn: book.isbn });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📚 Manage Books</h1>

      {/* Book Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="border p-2 rounded"
        />
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author"
          className="border p-2 rounded"
        />
        <input
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          placeholder="ISBN"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          {editId ? 'Update Book' : 'Add Book'}
        </button>
      </form>

      {/* Book List */}
      <div className="grid gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Status: {book.availability ? 'Available' : 'Borrowed'}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(book)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBooksPage;
