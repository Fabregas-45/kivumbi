const express = require('express');
const router  = express.Router();
const db      = require('../db');


router.get('/', (req, res) => {
  const sql = `
    SELECT b.id, b.title, b.description, p.id AS publisher_id, p.name AS publisher_name
    FROM books b
    JOIN publisher p ON b.publisher_id = p.id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post('/', (req, res) => {
  const { title, publisher_id, description } = req.body;
  db.query(
    'INSERT INTO books (title, publisher_id, description) VALUES (?, ?, ?)',
    [title, publisher_id, description],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(201);
    }
  );
});


router.put('/:id', (req, res) => {
  const { title, publisher_id, description } = req.body;
  db.query(
    'UPDATE books SET title=?, publisher_id=?, description=? WHERE id=?',
    [title, publisher_id, description, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});


router.delete('/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id=?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

module.exports = router;
