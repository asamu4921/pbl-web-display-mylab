const express = require('express');
const router = express.Router();
const db = require('../db');

// --- GET: Form tambah data ---
router.get('/create.rtf.iv.4', (req, res) => {
  let html = `


<h3 class="text-xl font-semibold mb-4">Tambah Jadwal Matkul — RTF.IV.4</h3>
<form action="/jadwalmatkul/create.rtf.iv.4" method="POST" class="ajax-form space-y-4" data-redirect="/jadwalmatkul/rtf.iv.4">

  <div>
    <label class="block mb-1">Matkul:</label>
    <input type="text" name="matkul" placeholder="Contoh: Basis Data" required class="w-full border px-3 py-2 rounded">
  </div>

  <div>
    <label class="block mb-1">Start Time:</label>
    <input type="time" name="start_time" required class="w-full border px-3 py-2 rounded">
  </div>

  <div>
    <label class="block mb-1">End Time:</label>
    <input type="time" name="end_time" required class="w-full border px-3 py-2 rounded">
  </div>

  <div>
    <label class="block mb-1">Kode Ruangan:</label>
    <input type="text" name="kode_ruangan" value="RTF.IV.4" readonly class="w-full border px-3 py-2 rounded bg-gray-100">
  </div>

  <div>
    <label class="block mb-1">Kelas:</label>
    <input type="text" name="kelas" placeholder="Contoh: A" required class="w-full border px-3 py-2 rounded">
  </div>

  <div>
    <label class="block mb-1">Dosen:</label>
    <input type="text" name="dosen" placeholder="Contoh: Pak Budi" required class="w-full border px-3 py-2 rounded">
  </div>

  <div>
    <label class="block mb-1">Hari:</label>
    <select name="hari" required class="w-full border px-3 py-2 rounded">
      ${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'].map(h => `<option value="${h}">${h}</option>`).join('')}
    </select>
  </div>

  <div class="flex justify-end space-x-2 pt-4 border-t mt-6">
    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Simpan</button>
    <button type="button" id="modal-close" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Tutup</button>
  </div>
</form>

  `;
  res.send(html);
});

// --- POST: Simpan ke DB ---
router.post('/create.rtf.iv.4', (req, res) => {
  console.log('[DEBUG] BODY:', req.body); // <-- DEBUG PENTING

  const { matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari } = req.body;

  if (!matkul) {
    return res.send('Data tidak valid.');
  }

  const sql = `
    INSERT INTO jadwal_matkul (matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('[DEBUG] INSERT error:', err);
      return res.send('Gagal menambah data.');
    }
    console.log('[DEBUG] Data berhasil disimpan:', result);
    res.send('sukses'); // <<< WAJIB: hanya string, jangan render HTML di sini
  });
});

module.exports = router;
