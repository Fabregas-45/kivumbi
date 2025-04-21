import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function BookSupplier() {
  const [links, setLinks] = useState([]);
  const [books, setBooks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ book_id: '', supplier_id: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [lRes, bRes, sRes] = await Promise.all([
      API.get('/book-supplier'),
      API.get('/books'),
      API.get('/supplier')
    ]);
    setLinks(lRes.data);
    setBooks(bRes.data);
    setSuppliers(sRes.data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/book-supplier', form);
    setForm({ book_id: '', supplier_id: '' });
    fetchAll();
  };

  const getBookTitle = id => books.find(b => b.id === id)?.title || 'Unknown';
  const getSupplierName = id => suppliers.find(s => s.id === id)?.name || 'Unknown';

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Book-Supplier Links</h2>
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
        <select
          className="border rounded p-2"
          value={form.supplier_id}
          onChange={e => setForm({ ...form, supplier_id: e.target.value })}
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button className="col-span-full bg-blue-600 text-white py-2 rounded">
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
