const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/indeks', (req, res) => {
    const tanggal = req.query.tanggal;

    let query = 'SELECT * FROM api';
    let params = [];

    if (tanggal) {
        query += ' WHERE tanggal_pinjam = ?';
        params.push(tanggal);
    }

    query += ' ORDER BY tanggal_pinjam DESC';

    db.query(query, params, (err, rows) => {
        if (err) return res.send('Gagal mengambil data API');

        let html = `
      <h3 class="text-xl font-semibold mb-4">Daftar Data API</h3>
      <div class="mb-4 flex gap-2 items-center">
        <input type="date" id="filterTanggalAPI" class="border px-2 py-1 rounded" />
        <button class="bg-blue-600 text-white px-4 py-1 rounded" id="btnFilterAPI">Filter</button>
      </div>

      <a href="/api/create" class="modal-open btn bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">+ Tambah Data</a>
      <table class="w-full border border-collapse">
        <thead>
          <tr class="bg-gray-200 text-sm">
            <th class="border px-2 py-1">ID</th>
            <th class="border px-2 py-1">NIM</th>
            <th class="border px-2 py-1">Nama</th>
            <th class="border px-2 py-1">Kegiatan</th>
            <th class="border px-2 py-1">Tanggal</th>
            <th class="border px-2 py-1">Jam</th>
            <th class="border px-2 py-1">Ruangan</th>
            <th class="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

        rows.forEach(row => {
            html += `
        <tr class="text-sm hover:bg-gray-100">
          <td class="border px-2 py-1">${row.id}</td>
          <td class="border px-2 py-1">${row.nim_mahasiswa}</td>
          <td class="border px-2 py-1">${row.nama_mahasiswa}</td>
          <td class="border px-2 py-1">${row.jenis_kegiatan}</td>
          <td class="border px-2 py-1">${row.tanggal_pinjam}</td>
          <td class="border px-2 py-1">${row.start_time} - ${row.end_time}</td>
          <td class="border px-2 py-1">${row.nama_ruangan}</td>
          <td class="border px-2 py-1 text-blue-600">
            <a href="/api/edit?id=${row.id}" class="modal-open mr-2">Edit</a>
            <a href="/api/delete?id=${row.id}" onclick="return confirm('Hapus data ini?')" class="ajax">Hapus</a>
          </td>
        </tr>
      `;
        });

        html += '</tbody></table>';
        res.send(html);
    });
});

module.exports = router;
