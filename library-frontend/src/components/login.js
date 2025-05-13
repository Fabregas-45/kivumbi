import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const { token, role: userRole } = response.data;
      if (!token || !userRole) throw new Error('Missing token or role');

      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);

      navigate(userRole === 'admin' ? '/admin' : '/user');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Check your credentials or register.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Library Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setRole('user')}
            className={`w-1/2 py-2 rounded-l font-medium ${
              role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`w-1/2 py-2 rounded-r font-medium ${
              role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 ">
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Dont have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
