import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import './index.css';
import Book from './components/Book';
import Publisher from './components/Publisher';
import Supplier from './components/Supplier';
import Store from './components/Store';
import Borrows from './components/Borrows';
import BookSupplier from './components/BookSupplier';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-700 p-4 text-white flex gap-4 justify-center">
          <NavLink to="/" className="hover:underline">Books</NavLink>
          <NavLink to="/publisher" className="hover:underline">Publishers</NavLink>
          <NavLink to="/supplier" className="hover:underline">Suppliers</NavLink>
          <NavLink to="/store" className="hover:underline">Store</NavLink>
          <NavLink to="/brow" className="hover:underline">Borrows</NavLink>
          <NavLink to="/book-supplier" className="hover:underline">Book-Supplier</NavLink>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Book />} />
            <Route path="/publisher" element={<Publisher />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/store" element={<Store />} />
            <Route path="/brow" element={<Borrows />} />
            <Route path="/book-supplier" element={<BookSupplier />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
