const express = require('express');
const router = express.Router();
const db = require('../db');

console.log('[DEBUG] Modul ruangdosen1.js berhasil di-load');

router.get('/ruangdosen1', (req, res) => {
  const filterTanggal = req.query.tanggal || new Date().toISOString().slice(0, 10);

  const sql = `
    SELECT id, nama_dosen, datetime, status
    FROM aktivitas_ruang_dosen
    WHERE nama_dosen IN ('saif', 'jokowi')
      AND DATE(datetime) = ?
    ORDER BY datetime DESC
  `;

  db.query(sql, [filterTanggal], (err, rows) => {
    if (err) return res.send('Gagal mengambil data ruang dosen 1');

    let html = `
        <h3 class="text-xl font-semibold">Status Ruang Dosen 1</h3>
        <div class="mb-4">
            <a href="/dosen/create.ruangdosen1" class="modal-open inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ➕ Tambah Data
            </a>
        </div>

        <div class="flex items-center mb-4 space-x-2">
            <label for="tanggalInput" class="font-medium">Filter Tanggal:</label>
            <input type="date" id="tanggalInput" value="${filterTanggal}" class="border rounded px-3 py-2" />
            <button id="filterTanggal" type="button" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Filter
            </button>
        </div>

      <table class="min-w-full border border-gray-200 shadow-sm text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-4 py-2 text-left">ID</th>
            <th class="border px-4 py-2 text-left">Nama Dosen</th>
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
          <td class="border px-4 py-2">${row.nama_dosen}</td>
          <td class="border px-4 py-2">${row.datetime}</td>
          <td class="border px-4 py-2">${row.status}</td>
          <td class="border px-4 py-2 space-x-2">
            <a href="/dosen/edit.ruangdosen1/${row.id}" class="modal-open bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
              ✏️ Edit
            </a>
<a href="/dosen/delete.ruangdosen1/${row.id}"
class="btn-delete-dosen bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
🗑️ Hapus
</a>


          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    res.send(html);
  });
});

module.exports = router;
