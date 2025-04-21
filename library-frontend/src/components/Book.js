import React, { useEffect, useState } from 'react';  
import API from '../services/api';


export default function Book() {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [form, setForm] = useState({ title: '', publisher_id: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchPublishers();
  }, []);

  const fetchBooks = async () => {
    const res = await API.get('/books');
    setBooks(res.data);
  };

  const fetchPublishers = async () => {
    const res = await API.get('/publisher');
    setPublishers(res.data);
  };

  const getPublisherName = id =>
    publishers.find(p => p.id === id)?.name || 'Unknown';

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await API.put(`/books/${editingId}`, form);
    } else {
      await API.post('/books', form);
    }
    setForm({ title: '', publisher_id: '', description: '' });
    setEditingId(null);
    fetchBooks();
  };

  const handleEdit = book => {
    setForm(book);
    setEditingId(book.id);
  };

  const handleDelete = id => {
    API.delete(`/books/${id}`).then(fetchBooks);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Books</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          className="border rounded p-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="border rounded p-2"
          value={form.publisher_id}
          onChange={e => setForm({ ...form, publisher_id: e.target.value })}
        >
          <option value="">Select Publisher</option>
          {publishers.map(pub => (
            <option key={pub.id} value={pub.id}>{pub.name}</option>
          ))}
        </select>
        <textarea
          className="border rounded p-2 md:col-span-2"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <button className="col-span-full bg-blue-600 text-white py-2 rounded">
          {editingId ? 'Update Book' : 'Add Book'}
        </button>
      </form>

      <ul className="space-y-3">
        {books.map(book => (
          <li key={book.id} className="flex justify-between bg-gray-100 p-4 rounded shadow">
            <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">Publisher: {getPublisherName(book.publisher_id)}</p>
              <p className="text-sm">{book.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(book)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
);
}
