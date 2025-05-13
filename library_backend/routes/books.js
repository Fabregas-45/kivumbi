import express from 'express';
import db from '../db.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.id, 
        b.title, 
        b.description, 
        p.id AS publisher_id, 
        p.name AS publisher_name,
        s.id AS supplier_id,
        s.name AS supplier_name
      FROM books b
      JOIN publisher p ON b.publisher_id = p.id
      JOIN supplier s ON b.supplier_id = s.id
    `);
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { title, publisher_id, supplier_id, description } = req.body;
  try {
    await db.query(
      'INSERT INTO books (title, publisher_id, supplier_id, description) VALUES (?, ?, ?, ?)',
      [title, publisher_id, supplier_id, description]
    );
    res.status(201).send('Book created successfully'); 
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { title, publisher_id, supplier_id, description } = req.body;
  try {
    await db.query(
      'UPDATE books SET title=?, publisher_id=?, supplier_id=?, description=? WHERE id=?',
      [title, publisher_id, supplier_id, description, req.params.id]
    );
    res.status(200).send('Book updated successfully'); 
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id=?', [req.params.id]);
    res.status(200).send('Book deleted successfully'); 
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
