import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: '', contact: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/supplier');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/supplier/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/supplier', form);
      }
      setForm({ name: '', contact: '' });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      console.error('Error saving supplier:', err);
    }
  };

  const handleEdit = (supplier) => {
    setForm({ name: supplier.name, contact: supplier.contact });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:5000/api/supplier/${id}`);
        fetchSuppliers();
      } catch (err) {
        console.error('Error deleting supplier:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Suppliers</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <input
          className="border rounded p-2"
          placeholder="Supplier Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Contact Info"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          required
        />
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
          {editingId ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>

      <ul className="space-y-3">
        {suppliers.map((s) => (
          <li
            key={s.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded shadow"
          >
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm">{s.contact}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(s)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
