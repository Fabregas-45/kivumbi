import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.book_id, s.quantity, b.title AS book_title
      FROM store s
      JOIN books b ON s.book_id = b.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { book_id, quantity } = req.body;
  try {
    await db.query(
      'INSERT INTO store (book_id, quantity) VALUES (?, ?)',
      [book_id, quantity]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { book_id, quantity } = req.body;
  try {
    await db.query(
      'UPDATE store SET book_id = ?, quantity = ? WHERE id = ?',
      [book_id, quantity, req.params.id]
    );
    res.status(200).send('Store entry updated successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM store WHERE id = ?', [req.params.id]);
    res.status(200).send('Book deleted from store');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
