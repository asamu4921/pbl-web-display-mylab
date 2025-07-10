const express = require('express');
const router = express.Router();
const db = require('../db');

// --- GET: Tampilkan form ---
router.get('/create.rtf.iv.4', (req, res) => {
  const html = `
    <h3 class="text-lg font-semibold mb-4">Tambah Aktivitas Lab — RTF.IV.4</h3>
    <form class="ajax-form space-y-4" action="/lab/create.rtf.iv.4" method="POST" data-redirect="/lab/RTF.IV.4">

      <div>
        <label for="nama_laboran" class="block mb-1 font-medium">Nama Laboran</label>
        <select name="nama_laboran" id="nama_laboran" class="w-full border px-3 py-2 rounded" required>
          <option value="">-- Pilih Laboran --</option>
          <option value="saif">Saif</option>
          <!-- Bisa tambah laboran lain di sini nanti -->
        </select>
      </div>

      <div>
        <label for="status" class="block mb-1 font-medium">Status</label>
        <input type="text" name="status" id="status" placeholder="Contoh: Mengelola Praktikum" class="w-full border px-3 py-2 rounded" required />
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Simpan</button>
        <button type="button" id="modal-close" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Batal</button>
      </div>
    </form>
  `;

  res.send(html);
});

// --- POST: Simpan ke DB ---
router.post('/create.rtf.iv.4', (req, res) => {
  const { nama_laboran, status } = req.body;

  if (!nama_laboran || !status) {
    return res.send('Data tidak lengkap.');
  }

  const sql = `
    INSERT INTO aktivitas_ruang_lab (nama_laboran, datetime, status)
    VALUES (?, NOW(), ?)
  `;
  const params = [nama_laboran, status];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('[ERROR] Gagal insert data lab:', err);
      return res.send('Gagal menyimpan data.');
    }

    res.send('sukses');
  });
});

module.exports = router;
