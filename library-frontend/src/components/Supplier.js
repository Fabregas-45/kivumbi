import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await API.get('/supplier');
    setSuppliers(res.data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post('/supplier', form);
    setForm({ name: '', contact: '' });
    fetchSuppliers();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Suppliers</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <input
          className="border rounded p-2"
          placeholder="Supplier Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded p-2"
          placeholder="Contact Info"
          value={form.contact}
          onChange={e => setForm({ ...form, contact: e.target.value })}
        />
        <button className="bg-green-600 text-white py-2 rounded">
          Add Supplier
        </button>
      </form>

      <ul className="space-y-3">
        {suppliers.map(s => (
          <li key={s.id} className="flex justify-between bg-gray-100 p-4 rounded shadow">
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm">{s.contact}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
);
}
