import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [form, setForm] = useState({ name: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/publisher');
      setPublishers(res.data);
    } catch (err) {
      console.error('Error loading publishers:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/publisher/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/publisher', form);
      }
      setForm({ name: '', address: '' });
      setEditingId(null);
      fetchPublishers();
    } catch (err) {
      console.error('Error saving publisher:', err);
    }
  };

  const handleEdit = (pub) => {
    setForm({ name: pub.name, address: pub.address });
    setEditingId(pub.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publisher?')) {
      try {
        await axios.delete(`http://localhost:5000/api/publisher/${id}`);
        fetchPublishers(); 
      } catch (err) {
        console.error('Error deleting publisher:', err);
        alert('Failed to delete publisher');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Publishers</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <button type="submit" className="bg-indigo-600 text-white py-2 rounded">
          {editingId ? 'Update' : 'Add'} Publisher
        </button>
      </form>

      <ul className="space-y-3">
        {publishers.map((pub) => (
          <li key={pub.id} className="flex justify-between items-center bg-gray-100 p-4 rounded shadow">
            <div>
              <p className="font-semibold">{pub.name}</p>
              <p className="text-sm">{pub.address}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(pub)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(pub.id)}
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
