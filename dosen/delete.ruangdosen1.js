const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/delete.ruangdosen1/:id', (req, res) => {
  const id = req.params.id;
  console.log('[DELETE DOSEN] ID:', id);

  const sql = `DELETE FROM aktivitas_ruang_dosen WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[DELETE DOSEN ERROR]', err);
      return res.send('Gagal menghapus data.');
    }
    console.log('[DELETE DOSEN OK]', result);
    res.send('sukses');
  });
});

module.exports = router;
