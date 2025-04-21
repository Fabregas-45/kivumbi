const express = require('express');
const router  = express.Router();
const db      = require('../db');


router.get('/', (req, res) => {
  const sql = `
    SELECT bs.id, bs.book_id, bs.supplier_id,
           b.title AS book_title, s.name AS supplier_name
    FROM book_supplier bs
    JOIN books b ON bs.book_id = b.id
    JOIN supplier s ON bs.supplier_id = s.id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { book_id, supplier_id } = req.body;
  db.query(
    'INSERT INTO book_supplier (book_id, supplier_id) VALUES (?, ?)',
    [book_id, supplier_id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(201);
    }
  );
});

module.exports = router;
