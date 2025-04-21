import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Store() {
  const [storeData, setStoreData] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ book_id: '', quantity: '' });

  useEffect(() => {
    fetchStore();
    fetchBooks();
  }, []);

  const fetchStore = async () => {
    const res = await API.get('/store');
    setStoreData(res.data);
  };

  const fetchBooks = async () => {
    const res = await API.get('/books');
    setBooks(res.data);
  };

  const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown';

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/store', form);
    setForm({ book_id: '', quantity: '' });
    fetchStore();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Store</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
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
          type="number"
          className="border rounded p-2"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded">Add to Store</button>
      </form>

      <ul className="mt-6 space-y-3">
        {storeData.map(s => (
          <li key={s.id} className="bg-gray-100 p-4 rounded shadow-sm">
            <p className="text-lg font-semibold">{getBookTitle(s.book_id)}</p>
            <p className="text-sm text-gray-600">Quantity: {s.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
