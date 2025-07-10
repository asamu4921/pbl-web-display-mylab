const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/delete.rtf.iv.4/:id', (req, res) => {
  const id = req.params.id;
  console.log('[DELETE LAB] ID:', id);

  const sql = `DELETE FROM aktivitas_ruang_lab WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[DELETE LAB ERROR]', err);
      return res.send('Gagal menghapus data.');
    }
    console.log('[DELETE LAB OK]', result);
    res.send('sukses');
  });
});

module.exports = router;
