import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [store, setStore] = useState([]);
  const [form, setForm] = useState({
    book_id: '',
    borrower_name: '',
    borrow_date: '',
    return_date: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchBorrows();
    fetchStore();
  }, []);

  const fetchBooks = async () => {
    const res = await API.get('/books');
    setBooks(res.data);
  };

  const fetchBorrows = async () => {
    const res = await API.get('/brow');
    setBorrows(res.data);
  };

  const fetchStore = async () => {
    const res = await API.get('/store');
    setStore(res.data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/brow', form);
    setForm({ book_id: '', borrower_name: '', borrow_date: '', return_date: '' });
    fetchBorrows();
    fetchStore();
  };

  const getBookTitle = id => books.find(b => b.id === parseInt(id))?.title || 'Unknown';

  const getStoreQuantity = bookId => {
    const match = store.find(s => s.book_id === bookId);
    return match ? match.quantity : 'N/A';
  };
  

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Borrow Records</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={form.book_id}
          onChange={e => setForm({ ...form, book_id: e.target.value })}
        >
          <option value="">Select Book</option>
          {books.map(b => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
        <input
          className="border rounded p-2"
          placeholder="Borrower Name"
          value={form.borrower_name}
          onChange={e => setForm({ ...form, borrower_name: e.target.value })}
        />
        <input
          type="date"
          className="border rounded p-2"
          value={form.borrow_date}
          onChange={e => setForm({ ...form, borrow_date: e.target.value })}
        />
        <input
          type="date"
          className="border rounded p-2"
          value={form.return_date}
          onChange={e => setForm({ ...form, return_date: e.target.value })}
        />
        <button className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add Borrow
        </button>
      </form>

      <ul className="space-y-3">
        {borrows.map(br => (
          <li key={br.id} className="bg-gray-100 p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-semibold">{getBookTitle(br.book_id)}</p>
              <p className="text-sm">By: {br.borrower_name}</p>
              <p className="text-sm">Borrowed: {br.borrow_date}</p>
              <p className="text-sm">Return by: {br.return_date}</p>
              <p className="text-sm text-gray-600">
                Remaining: {getStoreQuantity(br.book_id)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
