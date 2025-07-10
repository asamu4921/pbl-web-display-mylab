const express = require('express');
const router = express.Router();
const db = require('../db');

// --- GET: Form Edit ---
router.get('/edit.rtf.iv.4/:id', (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM jadwal_matkul WHERE id = ?`;
  db.query(sql, [id], (err, rows) => {
    if (err || rows.length === 0) {
      console.error('[DEBUG] Edit — Data tidak ditemukan:', err);
      return res.send('Data tidak ditemukan.');
    }

    const data = rows[0];

    let html = `


    <h3 class="text-xl font-semibold mb-4">Edit Jadwal Matkul — RTF.IV.4</h3>
    <form action="/jadwalmatkul/update.rtf.iv.4/${id}" method="POST" class="ajax-form space-y-4" data-redirect="/jadwalmatkul/RTF.IV.4">
    <div>
        <label class="block mb-1">Matkul:</label>
        <input type="text" name="matkul" value="${data.matkul}" required class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Start Time:</label>
        <input type="time" name="start_time" value="${data.start_time}" required class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">End Time:</label>
        <input type="time" name="end_time" value="${data.end_time}" required class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Kode Ruangan:</label>
        <input type="text" name="kode_ruangan" value="${data.kode_ruangan}" readonly class="w-full border px-3 py-2 rounded bg-gray-100">
    </div>

    <div>
        <label class="block mb-1">Kelas:</label>
        <input type="text" name="kelas" value="${data.kelas}" required class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Dosen:</label>
        <input type="text" name="dosen" value="${data.dosen}" required class="w-full border px-3 py-2 rounded">
    </div>

    <div>
        <label class="block mb-1">Hari:</label>
        <select name="hari" required class="w-full border px-3 py-2 rounded">
        ${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'].map(h => `
            <option value="${h}" ${data.hari === h ? 'selected' : ''}>${h}</option>
        `).join('')}
        </select>
    </div>

    <div class="flex justify-end space-x-2 pt-4 border-t mt-6">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Simpan Perubahan</button>
        <button type="button" id="modal-close" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Tutup</button>
    </div>
    </form>

    `;
    res.send(html);
  });
});

// --- POST: Simpan Update ---
router.post('/update.rtf.iv.4/:id', (req, res) => {
  console.log('[DEBUG] Update BODY:', req.body);

  const id = req.params.id;
  const { matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari } = req.body;

  if (!matkul) {
    return res.send('Data tidak valid.');
  }

  const sql = `
    UPDATE jadwal_matkul
    SET matkul = ?, start_time = ?, end_time = ?, kode_ruangan = ?, kelas = ?, dosen = ?, hari = ?
    WHERE id = ?
  `;
  const params = [matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari, id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('[DEBUG] UPDATE error:', err, 'DATA:', req.body);
      return res.send('Gagal mengupdate data.');
    }
    console.log('[DEBUG] Data berhasil diupdate:', result);
    res.send('sukses'); // Wajib plain string
  });
});

module.exports = router;
