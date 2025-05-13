import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//imports
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import publisherRoutes from './routes/publisher.js';
import supplierRoutes from './routes/supplier.js';
import storeRoutes from './routes/store.js';
import borrowsRoutes from './routes/borrows.js';
import book_supplierRoutes from './routes/book_supplier.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/publisher', publisherRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/store', storeRoutes);           
app.use('/api/borrows', borrowsRoutes);
app.use('/api/book-supplier', book_supplierRoutes);



app.get('/', (req, res) => {
  res.send(' Library Management API is running!');
});


app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
