const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/create.ruangdosen1', (req, res) => {
  const html = `
    <h3 class="text-lg font-semibold mb-4">Tambah Aktivitas Ruang Dosen 1</h3>
    <form class="ajax-form space-y-4" action="/dosen/ruangdosen1" data-redirect="/dosen/ruangdosen1">


      <div>
        <label for="nama_dosen" class="block mb-1 font-medium">Nama Dosen</label>
        <select name="nama_dosen" id="nama_dosen" class="w-full border px-3 py-2 rounded" required>
          <option value="">-- Pilih --</option>
          <option value="saif">Saif</option>
          <option value="jokowi">Jokowi</option>
        </select>
      </div>

      <div>
        <label for="status" class="block mb-1 font-medium">Status</label>
        <select name="status" id="status" class="w-full border px-3 py-2 rounded" required>
          <option value="">-- Pilih --</option>
          <option value="Didalam">Didalam</option>
          <option value="Diluar">Diluar</option>
        </select>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Simpan
        </button>
        <button type="button" id="modal-close" class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
          Batal
        </button>
      </div>

    </form>
  `;

  res.send(html);
});

router.post('/ruangdosen1', (req, res) => {
  const { nama_dosen, status } = req.body;
  const sql = `INSERT INTO aktivitas_ruang_dosen (nama_dosen, datetime, status) VALUES (?, NOW(), ?)`;

  db.query(sql, [nama_dosen, status], (err, result) => {
    if (err) {
      console.error('[ERROR] Gagal insert data:', err);
      return res.send('Gagal menyimpan data.');
    }

    res.send('sukses');
  });
});


module.exports = router;
