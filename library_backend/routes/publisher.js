import express from 'express';
import db from '../db.js'; 

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM publisher');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { name, address } = req.body;
  try {
    await db.query('INSERT INTO publisher (name, address) VALUES (?, ?)', [name, address]);
    res.status(201).send('Publisher created successfully');
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { name, address } = req.body;
  try {
    await db.query('UPDATE publisher SET name=?, address=? WHERE id=?', [name, address, req.params.id]);
    res.status(200).send('Publisher updated successfully');
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM publisher WHERE id=?', [req.params.id]);
    res.status(200).send('Publisher deleted successfully');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
 