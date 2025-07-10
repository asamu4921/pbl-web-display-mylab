const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('[DEBUG] Modul rtf.iv.4.js berhasil di-load');

router.get('/RTF.IV.4', (req, res) => {
  console.log('=======[DEBUG] GET /jadwalmatkul/RTF.IV.4 dipanggil =======');

  const filterHari = req.query.hari || 'Senin';
  console.log('[DEBUG] Filter hari:', filterHari);

  const sql = `
    SELECT id, matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari
    FROM jadwal_matkul
    WHERE kode_ruangan = 'RTF.IV.4' AND hari = ?
    ORDER BY start_time ASC
  `;
  console.log('[DEBUG] SQL:\n', sql);
  console.log('[DEBUG] Params:', [filterHari]);

  db.query(sql, [filterHari], (err, rows) => {
    if (err) {
      console.error('[DEBUG] Query error:', err);
      return res.send('Gagal mengambil data jadwal matkul.');
    }

    console.log(`[DEBUG] Jumlah baris hasil query: ${rows.length}`);

    let html = `
    <h3 class="text-xl font-semibold mb-4">Jadwal Matkul — RTF.IV.4</h3>

    <a href="/jadwalmatkul/create.rtf.iv.4"
        class="modal-open inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4">
        + Tambah Data
    </a>

    <div class="flex items-center mb-4 space-x-2">
        <label for="hariDropdown" class="font-medium">Pilih Hari:</label>
        <select id="hariDropdown" class="border rounded px-3 py-2">
        ${['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'].map(h => `
            <option value="${h}" ${filterHari === h ? 'selected' : ''}>${h}</option>
        `).join('')}
        </select>
        <button id="filterHari" type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Filter
        </button>
    </div>

    <table class="min-w-full border border-gray-200 shadow-sm text-sm">
        <thead>
        <tr class="bg-gray-100">
            <th class="border px-4 py-2 text-left">ID</th>
            <th class="border px-4 py-2 text-left">Matkul</th>
            <th class="border px-4 py-2 text-left">Mulai</th>
            <th class="border px-4 py-2 text-left">Selesai</th>
            <th class="border px-4 py-2 text-left">Kode Ruangan</th>
            <th class="border px-4 py-2 text-left">Kelas</th>
            <th class="border px-4 py-2 text-left">Dosen</th>
            <th class="border px-4 py-2 text-left">Hari</th>
            <th class="border px-4 py-2 text-left">Aksi</th>
        </tr>
        </thead>
        <tbody>
    `;

    rows.forEach(row => {
    html += `
        <tr class="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
        <td class="border px-4 py-2">${row.id}</td>
        <td class="border px-4 py-2">${row.matkul}</td>
        <td class="border px-4 py-2">${row.start_time}</td>
        <td class="border px-4 py-2">${row.end_time}</td>
        <td class="border px-4 py-2">${row.kode_ruangan}</td>
        <td class="border px-4 py-2">${row.kelas}</td>
        <td class="border px-4 py-2">${row.dosen}</td>
        <td class="border px-4 py-2">${row.hari}</td>
        <td class="border px-4 py-2 space-x-2">
            <a href="/jadwalmatkul/edit.rtf.iv.4/${row.id}"
            class="modal-open inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
            ✏️ Edit
            </a>
            <a href="/jadwalmatkul/delete.rtf.iv.4/${row.id}"
            class="btn-delete inline-block bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
            🗑️ Hapus
            </a>
        </td>
        </tr>
    `;
    });

    html += `
        </tbody>
    </table>
    `;


    res.send(html);
  });
});

module.exports = router;
