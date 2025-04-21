const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM publisher', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post('/', (req, res) => {
  const { name, address } = req.body;
  db.query(
    'INSERT INTO publisher (name, address) VALUES (?, ?)',
    [name, address],
    (err) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: err });
      }
      res.sendStatus(200);
    }
  );
});


router.put('/:id', (req, res) => {
  const { name, address } = req.body;
  db.query(
    'UPDATE publisher SET name=?, address=? WHERE id=?',
    [name, address, req.params.id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(200);
    }
  );
});

module.exports = router;
