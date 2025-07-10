const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/delete.rtf.iv.4/:id', (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM jadwal_matkul WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[DEBUG] DELETE error:', err);
      return res.send('Gagal menghapus data.');
    }
    console.log('[DEBUG] Data berhasil dihapus:', result);
    res.send('sukses');
  });
});

module.exports = router;
