import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Repeat,
  Building2,
  Truck,
  Store,
  LogOut,
  Library,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-4">
        <h1 className=" flex gap-2 text-2xl font-bold mb-6 flex items-center gap-2">
        <Library size={50} />
          Library Management
        </h1>

        <NavLink
          to="books"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? 'bg-blue-700' : ''
            }`
          }
        >
          <BookOpen className="text-white" />
          Books
        </NavLink>

        <NavLink
          to="borrows"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? 'bg-blue-700' : ''
            }`
          }
        >
          <Repeat className="text-white" />
          Borrows
        </NavLink>

        <NavLink
          to="publishers"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? 'bg-blue-700' : ''
            }`
          }
        >
          <Building2 className="text-white" />
          Publishers
        </NavLink>

        <NavLink
          to="suppliers"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? 'bg-blue-700' : ''
            }`
          }
        >
          <Truck className="text-white" />
          Suppliers
        </NavLink>

        <NavLink
          to="store"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded hover:bg-blue-700 ${
              isActive ? 'bg-blue-700' : ''
            }`
          }
        >
          <Store className="text-white" />
          Store
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition-all"
        >
          <LogOut />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
