import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LogOut,
  BookOpen,
  User,
  CalendarDays,
  Box,
  Store,
} from 'lucide-react';

export default function UserDashboard() {
  const [profile, setProfile] = useState({});
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchBorrows();
    fetchBooks();
    fetchStore();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const username = localStorage.getItem('username');
      const res = await axios.get(`http://localhost:5000/api/auth/${username}`);
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchBorrows = async () => {
    try {
      const username = localStorage.getItem('username');
      const res = await axios.get(`http://localhost:5000/api/borrows/auth/${username}`);
      setBorrows(res.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchStore = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/store');
      setStoreData(res.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };

  const getBookTitle = (id) =>
    books.find((b) => b.id === parseInt(id))?.title || 'Unknown';

  const getStoreQuantity = (bookId) => {
    const match = storeData.find((s) => s.book_id === bookId);
    return match ? match.quantity : 'N/A';
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-14 bg-gradient-to-tr from-indigo-50 to-blue-100 shadow-2xl rounded-3xl border border-blue-200">
      
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12 tracking-tight flex justify-center items-center gap-2">
        <BookOpen size={32} />
        User Dashboard
      </h2>

      <div className="mb-12 bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-200">
        <h3 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <User size={22} />
          Profile
        </h3>
        <p className="text-lg"><strong>Username:</strong> {profile.username}</p>
        <p className="text-lg"><strong>Role:</strong> {profile.role}</p>
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-blue-800 mb-5 flex items-center gap-2">
          <BookOpen size={22} />
          Borrowed Books
        </h3>
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {borrows.map((br) => (
            <li
              key={br.id}
              className="bg-gradient-to-r from-white to-blue-100 p-5 rounded-2xl border border-blue-200 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              <h4 className="text-xl font-bold text-blue-800">{getBookTitle(br.book_id)}</h4>
              <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                <User size={14} /> <strong>Borrower:</strong> {br.borrower_name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CalendarDays size={14} /> <strong>Borrowed:</strong> {br.borrow_date}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CalendarDays size={14} /> <strong>Return:</strong> {br.return_date}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Box size={14} /> <strong>In Store:</strong> {getStoreQuantity(br.book_id)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-blue-800 mb-5 flex items-center gap-2">
          <Store size={22} />
          Books In Store
        </h3>
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {storeData.map((s) => (
            <li
              key={s.id}
              className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all"
            >
              <h4 className="text-lg font-bold text-blue-800">{getBookTitle(s.book_id)}</h4>
              <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                <Box size={14} /> <strong>Quantity:</strong> {s.quantity}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
