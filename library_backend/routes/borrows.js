import express from 'express';
import db from '../db.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM borrows');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching borrows:', err);
    res.status(500).send('Failed to fetch borrows.');
  }
});


router.post('/', async (req, res) => {
  const { book_id, borrower_name, borrow_date, return_date } = req.body;

  try {
    const insertBorrowSql = `
      INSERT INTO borrows (book_id, borrower_name, borrow_date, return_date)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(insertBorrowSql, [book_id, borrower_name, borrow_date, return_date]);

    const updateStoreSql = `
      UPDATE store SET quantity = quantity - 1
      WHERE book_id = ? AND quantity > 0
    `;
    const [updateResult] = await db.query(updateStoreSql, [book_id]);

    if (updateResult.affectedRows === 0) {
      return res.status(400).send('Not enough books in store.');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling borrow:', err);
    res.status(500).send('Failed to process borrow.');
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { book_id, borrower_name, borrow_date, return_date,returned } = req.body;

  try {
    const updateSql = `
      UPDATE borrows
      SET book_id = ?, borrower_name = ?, borrow_date = ?, return_date = ?, returned = ?
      WHERE id = ?
    `;
    const [result] = await db.query(updateSql, [
      book_id,
      borrower_name,
      borrow_date,
      return_date,
      returned,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Borrow not found.');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating borrow:', err);
    res.status(500).send('Failed to update borrow.');
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    
    const [borrowRows] = await db.query('SELECT book_id FROM borrows WHERE id = ?', [id]);
    if (borrowRows.length === 0) {
      return res.status(404).send('Borrow not found.');
    }

    const bookId = borrowRows[0].book_id;

    const [deleteResult] = await db.query('DELETE FROM borrows WHERE id = ?', [id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send('Borrow not found.');
    }

   
    await db.query('UPDATE store SET quantity = quantity + 1 WHERE book_id = ?', [bookId]);

    res.sendStatus(200);
  } catch (err) {
    console.error('Error deleting borrow:', err);
    res.status(500).send('Failed to delete borrow.');
  }
});

export default router;
