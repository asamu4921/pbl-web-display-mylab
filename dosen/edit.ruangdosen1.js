const express = require('express');
const router = express.Router();
const db = require('../db');

// Form edit
router.get('/edit.ruangdosen1/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM aktivitas_ruang_dosen WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.send('<p>Data tidak ditemukan atau terjadi kesalahan.</p>');
    }

    const data = results[0];

    const html = `
      <h3 class="text-lg font-semibold mb-4">Edit Aktivitas Ruang Dosen 1</h3>
      <form class="ajax-form space-y-4" action="/dosen/update.ruangdosen1/${data.id}" data-redirect="/dosen/ruangdosen1" method="POST">

        <div>
          <label for="nama_dosen" class="block mb-1 font-medium">Nama Dosen</label>
          <select name="nama_dosen" id="nama_dosen" class="w-full border px-3 py-2 rounded" required>
            <option value="">-- Pilih --</option>
            <option value="saif" ${data.nama_dosen === 'saif' ? 'selected' : ''}>Saif</option>
            <option value="jokowi" ${data.nama_dosen === 'jokowi' ? 'selected' : ''}>Jokowi</option>
          </select>
        </div>

        <div>
          <label for="status" class="block mb-1 font-medium">Status</label>
          <select name="status" id="status" class="w-full border px-3 py-2 rounded" required>
            <option value="">-- Pilih --</option>
            <option value="Didalam" ${data.status === 'Didalam' ? 'selected' : ''}>Didalam</option>
            <option value="Diluar" ${data.status === 'Diluar' ? 'selected' : ''}>Diluar</option>
          </select>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Update
          </button>
          <button type="button" id="modal-close" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
            Batal
          </button>
        </div>

      </form>
    `;

    res.send(html);
  });
});

// Proses update
router.post('/update.ruangdosen1/:id', (req, res) => {
  const id = req.params.id;
  const { nama_dosen, status } = req.body;

  const sql = `UPDATE aktivitas_ruang_dosen SET nama_dosen = ?, status = ? WHERE id = ?`;

  db.query(sql, [nama_dosen, status, id], (err, result) => {
    if (err) {
      console.error('[ERROR] Gagal update data:', err);
      return res.send('Gagal mengupdate data.');
    }

    res.send('sukses');
  });
});

module.exports = router;
