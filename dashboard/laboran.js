// dashboard/laboran.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const user = req.session.user || { nama: 'Laboran' };
  res.send(`<h1>Selamat Datang Laboran ${user.nama}</h1>`);
});

console.log('[DEBUG] Modul dashboard/laboran.js berhasil di-load');

module.exports = router;
