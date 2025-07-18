const conn = require('../db');

// GET list jadwal matkul (sudah ada)
exports.getJadwal = (req, res) => {
  const kodeRuangan = req.query.kode_ruangan || '';

  let sql = 'SELECT * FROM jadwal_matkul';
  const params = [];

  if (kodeRuangan) {
    sql += ' WHERE kode_ruangan = ?';
    params.push(kodeRuangan);
  }

  conn.query(sql, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// GET list ruangan unik (sudah ada)
exports.getRuanganList = (req, res) => {
  conn.query(
    'SELECT DISTINCT kode_ruangan, nama_ruangan FROM api ORDER BY kode_ruangan',
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
};

// POST tambah jadwal baru
exports.createJadwal = (req, res) => {
  const { matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari } = req.body;

  if (!matkul || !start_time || !end_time || !kode_ruangan || !kelas || !dosen || !hari) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const sql = `
    INSERT INTO jadwal_matkul (matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  conn.query(sql, [matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari], (err, result) => {
    if (err) {
      console.error('[x] Gagal tambah jadwal:', err);
      return res.status(500).json({ message: 'Gagal tambah data' });
    }
    console.log(`[+] Jadwal baru ditambahkan, ID: ${result.insertId}`);
    res.json({ message: 'Tambah jadwal berhasil', id: result.insertId });
  });
};

// POST edit jadwal
exports.editJadwal = (req, res) => {
  const { id, matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  const sql = `
    UPDATE jadwal_matkul
    SET matkul = ?, start_time = ?, end_time = ?, kode_ruangan = ?, kelas = ?, dosen = ?, hari = ?
    WHERE id = ?
  `;

  conn.query(sql, [matkul, start_time, end_time, kode_ruangan, kelas, dosen, hari, id], (err, result) => {
    if (err) {
      console.error('[x] Gagal edit jadwal:', err);
      return res.status(500).json({ message: 'Gagal edit data' });
    }
    console.log(`[✓] Jadwal dengan ID ${id} berhasil diupdate`);
    res.json({ message: 'Edit jadwal berhasil' });
  });
};

// DELETE jadwal
exports.deleteJadwal = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  const sql = `DELETE FROM jadwal_matkul WHERE id = ?`;

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[x] Gagal hapus jadwal:', err);
      return res.status(500).json({ message: 'Gagal hapus data' });
    }
    console.log(`[-] Jadwal dengan ID ${id} berhasil dihapus`);
    res.json({ message: 'Hapus jadwal berhasil' });
  });
};
