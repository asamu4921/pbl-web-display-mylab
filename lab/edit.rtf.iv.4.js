const express = require('express');
const router = express.Router();
const db = require('../db');

// --- GET: Tampilkan form edit ---
router.get('/edit.rtf.iv.4/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM aktivitas_ruang_lab WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.send('<p>Data tidak ditemukan atau terjadi kesalahan.</p>');
    }

    const data = results[0];

    const html = `
      <h3 class="text-lg font-semibold mb-4">Edit Aktivitas Lab — RTF.IV.4</h3>
      <form class="ajax-form space-y-4" action="/lab/update.rtf.iv.4/${data.id}" method="POST" data-redirect="/lab/RTF.IV.4">

        <div>
          <label for="nama_laboran" class="block mb-1 font-medium">Nama Laboran</label>
          <select name="nama_laboran" id="nama_laboran" class="w-full border px-3 py-2 rounded" required>
            <option value="">-- Pilih Laboran --</option>
            <option value="saif" ${data.nama_laboran === 'saif' ? 'selected' : ''}>Saif</option>
            <!-- Bisa tambah laboran lain di sini nanti -->
          </select>
        </div>

        <div>
          <label for="status" class="block mb-1 font-medium">Status</label>
          <input type="text" name="status" id="status" value="${data.status}" class="w-full border px-3 py-2 rounded" required />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Update</button>
          <button type="button" id="modal-close" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Batal</button>
        </div>
      </form>
    `;

    res.send(html);
  });
});

// --- POST: Update data ke DB ---
router.post('/update.rtf.iv.4/:id', (req, res) => {
  const id = req.params.id;
  const { nama_laboran, status } = req.body;

  if (!nama_laboran || !status) {
    return res.send('Data tidak lengkap.');
  }

  const sql = `
    UPDATE aktivitas_ruang_lab
    SET nama_laboran = ?, status = ?
    WHERE id = ?
  `;
  const params = [nama_laboran, status, id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('[ERROR] Gagal update data lab:', err);
      return res.send('Gagal mengupdate data.');
    }

    res.send('sukses');
  });
});

module.exports = router;
