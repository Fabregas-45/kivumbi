import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  UserRound,
  UsersRound,
  CalendarDays,
  PlusCircle,
  Boxes
} from 'lucide-react';

export default function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [store, setStore] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    book_id: '',
    borrower_name: '',
    borrow_date: '',
    return_date: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchBorrows();
    fetchStore();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchBorrows = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/borrows');
      setBorrows(res.data);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    }
  };

  const fetchStore = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/store');
      setStore(res.data);
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userExists = users.some(
      (user) => user.username.toLowerCase().trim() === form.borrower_name.toLowerCase().trim()
    );

    if (!userExists) {
      setError(' Borrower must be a registered user.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/borrows', form);
      setForm({ book_id: '', borrower_name: '', borrow_date: '', return_date: '' });
      fetchBorrows();
      fetchStore();
      setError('');

      const currentUsername = localStorage.getItem('username');
      if (currentUsername && form.borrower_name === currentUsername) {
        navigate('./UserDashboard');
      }
    } catch (error) {
      console.error('Error submitting borrow record:', error);
    }
  };

  const getBookTitle = (id) =>
    books.find((b) => b.id === parseInt(id))?.title || 'Unknown';

  const getStoreQuantity = (bookId) => {
    const match = store.find((s) => s.book_id === bookId);
    return match ? match.quantity : 'N/A';
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-14 bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-3xl">
      <h2 className="text-4xl font-black text-center text-blue-800 mb-10 tracking-tight flex items-center justify-center gap-2">
        <BookOpen className="w-8 h-8 text-blue-800" />
        Borrow Book Records
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-300 rounded-lg px-4 py-2 mb-6 text-center font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-md mb-12">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Select Book</label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.book_id}
            onChange={(e) => setForm({ ...form, book_id: e.target.value })}
          >
            <option value="">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Choose a book
            </option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Select Borrower</label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            value={form.borrower_name}
            onChange={(e) => setForm({ ...form, borrower_name: e.target.value })}
          >
            <option value="">
              <UserRound className="inline w-4 h-4 mr-1" />
              Choose a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Borrow Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            value={form.borrow_date}
            onChange={(e) => setForm({ ...form, borrow_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Return Date</label>
          <input
            type="date"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            value={form.return_date}
            onChange={(e) => setForm({ ...form, return_date: e.target.value })}
          />
        </div>

        <div className="col-span-full">
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg transition font-bold text-lg shadow-md flex justify-center items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Add Borrow Record
          </button>
        </div>
      </form>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
          <UsersRound className="w-5 h-5 text-blue-700" />
          Registered Users
        </h3>
        <div className="flex flex-wrap gap-2 text-sm">
          {users.map((user) => (
            <span key={user.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm">
              {user.username}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-700" />
        Current Borrow Records
      </h3>

      <ul className="space-y-4">
  {borrows.map((br) => {
    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD
    const isOverdue = br.return_date < today && !br.returned;
    const isReturned = br.returned;

    let returnStyle = 'text-gray-600'; // Default
    if (isReturned) returnStyle = 'text-green-600 font-semibold';
    else if (isOverdue) returnStyle = 'text-red-600 font-semibold';

    return (
      <li
        key={br.id}
        className="bg-white border-l-4 border-blue-600 p-5 rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        <h4 className="text-lg font-bold text-blue-800">{getBookTitle(br.book_id)}</h4>

        <p className="text-sm text-gray-600 flex items-center gap-1">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <strong>From:</strong> {br.borrow_date}
        </p>

        <p className={`text-sm flex items-center gap-1 ${returnStyle}`}>
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <strong>Return By:</strong> {br.return_date}
        </p>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Boxes className="w-4 h-4 text-gray-400" />
          <strong>Remaining:</strong> {getStoreQuantity(br.book_id)}
        </p>

        {isReturned && (
          <p className="text-sm mt-1 text-green-700 font-semibold">✓ Book Returned</p>
        )}
      </li>
    );
  })}
</ul>

    </div>
  );
}
