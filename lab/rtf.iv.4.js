const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('[DEBUG] Modul lab/rtf.iv.4.js berhasil di-load');

router.get('/RTF.IV.4', (req, res) => {
  console.log('=======[DEBUG] GET /lab/RTF.IV.4 dipanggil =======');

  const filterTanggal = req.query.tanggal || new Date().toISOString().slice(0, 10);
  console.log('[DEBUG] Tanggal filter:', filterTanggal);

  const sql = `
    SELECT id, nama_laboran, datetime, status
    FROM aktivitas_ruang_lab
    WHERE nama_laboran = 'saif' AND DATE(datetime) = ?
    ORDER BY datetime DESC
  `;
  console.log('[DEBUG] SQL:', sql);
  console.log('[DEBUG] Params:', [filterTanggal]);

  db.query(sql, [filterTanggal], (err, rows) => {
    if (err) {
      console.error('[DEBUG] Query error:', err);
      return res.send('Gagal mengambil data ruang lab RTF.IV.4');
    }

    console.log(`[DEBUG] Jumlah baris: ${rows.length}`);

    let html = `
      <h3 class="text-xl font-semibold mb-4">Ruang RTF.IV.4</h3>
        <div class="mb-4">
            <a href="/lab/create.rtf.iv.4" class="modal-open inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ➕ Tambah Data
            </a>
        </div>
      <div class="flex items-center mb-4 space-x-2">
        <label for="tanggalInput" class="font-medium">Filter Tanggal:</label>
        <input type="date" id="tanggalInput" value="${filterTanggal}" class="border rounded px-3 py-2" />
        <button id="filterTanggalLab" type="button" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Filter</button>
      </div>

      <table class="min-w-full border border-gray-200 shadow-sm text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2 text-left">ID</th>
            <th class="border px-4 py-2 text-left">Nama Laboran</th>
            <th class="border px-4 py-2 text-left">Datetime</th>
            <th class="border px-4 py-2 text-left">Status</th>
            <th class="border px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

    rows.forEach(row => {
      html += `
        <tr class="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
          <td class="border px-4 py-2">${row.id}</td>
          <td class="border px-4 py-2">${row.nama_laboran}</td>
          <td class="border px-4 py-2">${row.datetime}</td>
          <td class="border px-4 py-2">${row.status}</td>
          <td class="border px-4 py-2 space-x-2">
            <a href="/lab/edit.rtf.iv.4/${row.id}" class="modal-open inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">✏️ Edit</a>
            <a href="/lab/delete.rtf.iv.4/${row.id}" 
              class="btn-delete-lab inline-block bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
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
