import { useEffect, useState } from 'react';
import api from '../services/api.js';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBooks(res.data);
      } catch {
        setError('Failed to fetch books');
      }      
    };

    fetchBooks();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📚 Available Books</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-semibold text-lg">{book.title}</h2>
            <p className="text-sm text-gray-600">Author: {book.author}</p>
            <p className="text-sm">ISBN: {book.isbn}</p>
            <p className={`text-sm font-semibold ${book.availability ? 'text-green-600' : 'text-red-500'}`}>
              {book.availability ? 'Available' : 'Not Available'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksPage;
