// routes/borrows.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all borrows
router.get('/', (req, res) => {
  db.query('SELECT * FROM borrows', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// ADD a borrow AND decrease store quantity
router.post('/', (req, res) => {
  const { book_id, borrower_name, borrow_date, return_date } = req.body;

  // First, insert the borrow record
  const insertBorrowSql = 'INSERT INTO borrows (book_id, borrower_name, borrow_date, return_date) VALUES (?, ?, ?, ?)';
  db.query(insertBorrowSql, [book_id, borrower_name, borrow_date, return_date], (err, result) => {
    if (err) {
      console.error('Failed to insert borrow:', err);
      return res.status(500).send('Error adding borrow record.');
    }

    // Then, decrease the quantity in the store
    const updateStoreSql = 'UPDATE store SET quantity = quantity - 1 WHERE book_id = ? AND quantity > 0';
    db.query(updateStoreSql, [book_id], (err2, result2) => {
      if (err2) {
        console.error('Failed to update store quantity:', err2);
        return res.status(500).send('Borrow added but failed to update store.');
      }

      // Check if store was updated
      if (result2.affectedRows === 0) {
        return res.status(400).send('Not enough books in store.');
      }

      res.sendStatus(200);
    });
  });
});

module.exports = router;
