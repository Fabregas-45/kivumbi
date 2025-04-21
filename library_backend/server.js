const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config()

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const books = require('./routes/books');
const publisher = require('./routes/publisher');
const supplier = require('./routes/supplier');
const store = require('./routes/store');
const borrows = require('./routes/borrows');
const bookSupplier = require('./routes/bookSupplier');

app.use('/books', books);
app.use('/publisher', publisher);
app.use('/supplier', supplier);
app.use('/store', store);
app.use('/brow', borrows);
app.use('/book-supplier', bookSupplier);

app.listen(port, () => console.log(`Server running on port ${port}`));
