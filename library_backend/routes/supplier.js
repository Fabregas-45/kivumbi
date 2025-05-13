import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM supplier');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  const { name, contact } = req.body;

  try {
    const insertSql = 'INSERT INTO supplier (name, contact) VALUES (?, ?)';
    await db.query(insertSql, [name, contact]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  const { name, contact } = req.body;
  const { id } = req.params;

  try {
    const updateSql = 'UPDATE supplier SET name = ?, contact = ? WHERE id = ?';
    const [result] = await db.query(updateSql, [name, contact, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteSql = 'DELETE FROM supplier WHERE id = ?';
    const [result] = await db.query(deleteSql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.sendStatus(204); 
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
