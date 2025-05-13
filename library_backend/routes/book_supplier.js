import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  const sql = `
    SELECT bs.id, bs.book_id, bs.supplier_id,
           b.title AS book_title, s.name AS supplier_name
    FROM book_supplier bs
    JOIN books b ON bs.book_id = b.id
    JOIN supplier s ON bs.supplier_id = s.id
  `;

  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { book_id, supplier_id } = req.body;

  try {
    await db.query(
      'INSERT INTO book_supplier (book_id, supplier_id) VALUES (?, ?)',
      [book_id, supplier_id]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
