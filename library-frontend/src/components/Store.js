import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Store() {
  const [storeData, setStoreData] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ book_id: '', quantity: '' });
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStore();
    fetchBooks();
  }, []);

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/store');
      setStoreData(res.data);
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const getBookTitle = (id) => books.find(b => b.id === parseInt(id))?.title || 'Unknown';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.quantity <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        // Update
        await axios.put(`http://localhost:5000/api/store/${editingId}`, form);
        setEditingId(null);
      } else {
        // Add
        await axios.post('http://localhost:5000/api/store', form);
      }
      setForm({ book_id: '', quantity: '' });
      fetchStore();
    } catch (err) {
      console.error('Error saving to store:', err);
      alert('Error saving book to store');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book from the store?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/store/${id}`);
      fetchStore();
    } catch (err) {
      console.error('Error deleting from store:', err);
    }
  };

  const handleEdit = (item) => {
    setForm({ book_id: item.book_id, quantity: item.quantity });
    setEditingId(item.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Store</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <select
          className="border rounded p-2"
          value={form.book_id}
          onChange={e => setForm({ ...form, book_id: e.target.value })}
          required
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
          required
        />
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded">
          {editingId ? 'Update Store' : 'Add to Store'}
        </button>
      </form>

      {loading ? (
        <p>Loading store data...</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {storeData.length > 0 ? (
            storeData.map(s => (
              <li
                key={s.id}
                className="bg-gray-100 p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{getBookTitle(s.book_id)}</p>
                  <p className="text-sm text-gray-600">Quantity: {s.quantity}</p>
                </div>
                <div className="space-x-2">
                  <button
                    className="bg-yellow-400 text-black px-3 py-1 rounded"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No books in store.</p>
          )}
        </ul>
      )}
    </div>
  );
}
