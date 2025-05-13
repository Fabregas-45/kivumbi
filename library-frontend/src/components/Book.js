import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpenCheck, Pencil, Trash2 } from 'lucide-react';

export default function Book() {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ title: '', publisher_id: '', supplier_id: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchPublishers();
    fetchSuppliers();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchPublishers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/publisher');
      setPublishers(response.data);
    } catch (error) {
      console.error('Error fetching publishers:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supplier');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const getPublisherName = (id) =>
    publishers.find((p) => p.id === id)?.name || 'Unknown';

  const getSupplierName = (id) =>
    suppliers.find((s) => s.id === id)?.name || 'Unknown';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/books/${editingId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/books', form);
      }
      setForm({ title: '', publisher_id: '', supplier_id: '', description: '' });
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 flex items-center justify-center gap-2">
        <BookOpenCheck className="w-8 h-8 text-blue-800" />
        Book Collection
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 grid md:grid-cols-2 gap-4 mb-12"
      >
        <input
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Book Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded-lg p-3"
          value={form.publisher_id}
          onChange={(e) => setForm({ ...form, publisher_id: e.target.value })}
        >
          <option value="">Select Publisher</option>
          {publishers.map((pub) => (
            <option key={pub.id} value={pub.id}>
              {pub.name}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg p-3"
          value={form.supplier_id}
          onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>
        <textarea
          className="border border-gray-300 rounded-lg p-3 md:col-span-2 resize-none"
          placeholder="Book Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="col-span-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
          {editingId ? 'Update Book' : 'Add Book'}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Publisher:{' '}
                <span className="font-medium text-gray-800">
                  {getPublisherName(book.publisher_id)}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Supplier:{' '}
                <span className="font-medium text-gray-800">
                  {getSupplierName(book.supplier_id)}
                </span>
              </p>
              <p className="text-sm text-gray-700">{book.description}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm shadow-sm hover:scale-105 transition-transform"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow-sm hover:scale-105 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No books available yet.
        </p>
      )}
    </div>
  );
}
