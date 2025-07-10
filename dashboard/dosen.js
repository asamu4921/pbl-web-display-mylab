const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const nama = req.session.user?.nama || 'Dosen';
  res.send(`
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Dashboard Dosen</h2>
      <p>Halo, <strong>${nama}</strong>! Selamat datang di ruang dosen.</p>
    </div>
  `);
});

module.exports = router;
