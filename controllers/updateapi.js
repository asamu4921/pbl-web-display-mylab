const mysql = require('mysql2');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const conn = require('../db'); // Pake koneksi globalmu

exports.updateAPI = async (req, res) => {
  const apiUrl = 'https://peminjaman.polibatam.ac.id/api-penru/data-peminjaman';
  const apiKey = '9a89a3be-1d44-4e81-96a8-585cb0453718';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'api-key': apiKey }
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('[x] Data API tidak valid atau kosong.');
      return res.status(500).json({ message: 'Data API tidak valid' });
    }

    console.log(`[i] Jumlah data diterima dari API: ${data.length}`);

    // Simpan ke DB
    simpanKeDatabase(data, res);

  } catch (err) {
    console.error('[x] Gagal ambil data dari API:', err);
    return res.status(500).json({ message: 'Gagal ambil data dari API' });
  }
};
exports.editAPI = (req, res) => {
  const {
    id, nim_mahasiswa, nama_mahasiswa, jenis_kegiatan, nama_kegiatan_other,
    tanggal_pinjam, start_time, end_time, kode_ruangan, nama_ruangan,
    gedung_ruangan, nik_penanggungjawab, nama_penanggungjawab
  } = req.body;

  if (!id) {
    console.error('[x] EditAPI: ID kosong!');
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  console.log(`[i] EditAPI: Request update ID ${id}`);
  console.log({
    nim_mahasiswa, nama_mahasiswa, jenis_kegiatan, nama_kegiatan_other,
    tanggal_pinjam, start_time, end_time, kode_ruangan, nama_ruangan,
    gedung_ruangan, nik_penanggungjawab, nama_penanggungjawab
  });

  const updateQuery = `
    UPDATE api SET
      nim_mahasiswa = ?, nama_mahasiswa = ?, jenis_kegiatan = ?,
      nama_kegiatan_other = ?, tanggal_pinjam = ?, start_time = ?, end_time = ?,
      kode_ruangan = ?, nama_ruangan = ?, gedung_ruangan = ?,
      nik_penanggungjawab = ?, nama_penanggungjawab = ?
    WHERE id = ?
  `;

  conn.query(updateQuery, [
    nim_mahasiswa, nama_mahasiswa, jenis_kegiatan, nama_kegiatan_other,
    tanggal_pinjam, start_time, end_time, kode_ruangan, nama_ruangan,
    gedung_ruangan, nik_penanggungjawab, nama_penanggungjawab, id
  ], (err, result) => {
    if (err) {
      console.error('[x] Gagal update:', err);
      return res.status(500).json({ message: 'Gagal update data' });
    }

    console.log(`[✓] Data dengan ID ${id} berhasil diupdate | Rows affected: ${result.affectedRows}`);
    res.json({ message: 'Update berhasil', affectedRows: result.affectedRows });
  });
};


exports.deleteAPI = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  const deleteQuery = `DELETE FROM api WHERE id = ?`;

  conn.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('[x] Gagal hapus:', err);
      return res.status(500).json({ message: 'Gagal hapus data' });
    }

    console.log(`[✓] Data dengan ID ${id} berhasil dihapus`);
    res.json({ message: 'Hapus berhasil', affectedRows: result.affectedRows });
  });
};

// Proses 1 per 1
function simpanKeDatabase(dataList, res) {
  let index = 0;
  let berhasil = 0;

  function prosesSatuPerSatu() {
    if (index >= dataList.length) {
      console.log(`[✓] Proses selesai. Total data baru disimpan: ${berhasil}`);
      return res.json({ message: `Proses selesai. Data baru disimpan: ${berhasil}` });
    }

    const item = dataList[index++];
    const {
      nim_mahasiswa, nama_mahasiswa, jenis_kegiatan, nama_kegiatan_other,
      tanggal_pinjam, start_time, end_time, kode_ruangan,
      nama_ruangan, gedung_ruangan, nik_penanggungjawab, nama_penanggungjawab
    } = item;

    const cekQuery = `
      SELECT id FROM api WHERE nim_mahasiswa = ? AND tanggal_pinjam = ? AND start_time = ?
    `;

    conn.query(cekQuery, [nim_mahasiswa, tanggal_pinjam, start_time], (cekErr, rows) => {
      if (cekErr) {
        console.error('[x] Gagal cek duplikat:', cekErr);
        return prosesSatuPerSatu();
      }

      if (rows.length > 0) {
        console.log(`[!] Duplikat dilewati: ${nim_mahasiswa} (${tanggal_pinjam} ${start_time})`);
        return prosesSatuPerSatu();
      }

      const insertQuery = `
        INSERT INTO api (
          nim_mahasiswa, nama_mahasiswa, jenis_kegiatan,
          nama_kegiatan_other, tanggal_pinjam, start_time, end_time,
          kode_ruangan, nama_ruangan, gedung_ruangan,
          nik_penanggungjawab, nama_penanggungjawab
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      conn.query(insertQuery, [
        nim_mahasiswa, nama_mahasiswa, jenis_kegiatan,
        nama_kegiatan_other, tanggal_pinjam, start_time, end_time,
        kode_ruangan, nama_ruangan, gedung_ruangan,
        nik_penanggungjawab, nama_penanggungjawab
      ], (insertErr) => {
        if (insertErr) {
          console.error(`[x] Gagal insert: ${nim_mahasiswa} (${tanggal_pinjam})`, insertErr);
        } else {
          console.log(`[✓] Data disimpan: ${nim_mahasiswa} (${tanggal_pinjam} ${start_time})`);
          berhasil++;
        }
        prosesSatuPerSatu();
      });
    });
  }

  prosesSatuPerSatu();
}
