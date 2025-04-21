const express = require('express');
const router  = express.Router();
const db      = require('../db');


router.get('/', (req, res) => {
  const sql = `
    SELECT s.id, s.book_id, s.quantity, b.title AS book_title
    FROM store s
    JOIN books b ON s.book_id = b.id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { book_id, quantity } = req.body;
  db.query(
    'INSERT INTO store (book_id, quantity) VALUES (?, ?)',
    [book_id, quantity],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(201);
    }
  );
});

module.exports = router;
