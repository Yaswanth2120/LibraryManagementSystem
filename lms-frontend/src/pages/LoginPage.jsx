import { useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { email, password });

      // Store token and role locally
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      // Navigate based on role (we’ll later build these dashboards)
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'librarian') navigate('/librarian');
      else navigate('/student');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-white">
      <h2 className="text-3xl font-bold text-gray-800">Login to LibriSys</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
