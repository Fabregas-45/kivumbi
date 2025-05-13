import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
});

export default function BookSupplier() {
  const [links, setLinks] = useState([]);
  const [books, setBooks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ book_id: '', supplier_id: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [lRes, bRes, sRes] = await Promise.all([
        api.get('/book-supplier'),
        api.get('/books'),
        api.get('/supplier'),
      ]);
      setLinks(lRes.data);
      setBooks(bRes.data);
      setSuppliers(sRes.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(`Failed to fetch data: ${msg}`);
      console.error('Fetch error:', err);
    }
  };
  

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/book-supplier', form); 
      setForm({ book_id: '', supplier_id: '' });
      fetchAll();
    } catch (err) {
      setError('Failed to link book and supplier.');
      console.error(err);
    }
  };

  const getBookTitle = id => books.find(b => b.id === parseInt(id))?.title || 'Unknown';
  const getSupplierName = id => suppliers.find(s => s.id === parseInt(id))?.name || 'Unknown';

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Book-Supplier Links</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
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
        <select
          className="border rounded p-2"
          value={form.supplier_id}
          onChange={e => setForm({ ...form, supplier_id: e.target.value })}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded">
          Link Book & Supplier
        </button>
      </form>

      <ul className="space-y-3">
        {links.map(link => (
          <li key={link.id} className="bg-gray-100 p-4 rounded shadow flex justify-between">
            <p>
              <strong>{getBookTitle(link.book_id)}</strong> ↔ {getSupplierName(link.supplier_id)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
