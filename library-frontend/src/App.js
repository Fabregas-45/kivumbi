import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register'; 

import Book from './components/Book';
import Borrows from './components/Borrows';
import Publisher from './components/Publisher';
import Supplier from './components/Supplier';
import Store from './components/Store';

import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('role');
  return userRole === role ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Book />} />
          <Route path="books" element={<Book />} />
          <Route path="borrows" element={<Borrows />} />
          <Route path="publishers" element={<Publisher />} />
          <Route path="suppliers" element={<Supplier />} />
          <Route path="store" element={<Store />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Book />} />
          <Route path="books" element={<Book />} />
          <Route path="borrows" element={<Borrows />} />
          
        </Route>
      </Routes>
    </Router>
  );
}
export default App;