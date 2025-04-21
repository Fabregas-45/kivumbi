const express = require('express');
const router  = express.Router();
const db      = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM supplier', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post('/', (req, res) => {
  const { name, contact } = req.body;
  db.query(
    'INSERT INTO supplier (name, contact) VALUES (?, ?)',
    [name, contact],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.sendStatus(201);
    }
  );
});

module.exports = router;
