const conn = require('../db');

const grup1 = ['hanif', 'naurah', 'kavit'];
const grup2 = ['uruguai', 'argentina', 'indonesia'];

// Ambil data + grup
exports.getAktivitasDosen = (req, res) => {
  conn.query('SELECT * FROM aktivitas_ruang_dosen', (err, results) => {
    if (err) {
      console.error('[x] DB ERROR getAktivitasDosen:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const g1 = results.filter(r => grup1.includes(r.nama_dosen.toLowerCase()));
    const g2 = results.filter(r => grup2.includes(r.nama_dosen.toLowerCase()));

    console.log(`[i] getAktivitasDosen => Grup1: ${g1.length} | Grup2: ${g2.length}`);
    res.json({ grup1: g1, grup2: g2, grupList: grup1.concat(grup2) });
  });
};

// Tambah: nama_dosen & status, tanggal otomatis
exports.tambahAktivitasDosen = (req, res) => {
  const { nama_dosen, status } = req.body;

  if (!nama_dosen || !status) {
    return res.status(400).json({ message: 'Nama dosen & status wajib diisi' });
  }

  const namaLower = nama_dosen.toLowerCase();
  if (!grup1.includes(namaLower) && !grup2.includes(namaLower)) {
    return res.status(400).json({ message: 'Nama dosen tidak valid' });
  }

  const sql = `
    INSERT INTO aktivitas_ruang_dosen (nama_dosen, datetime, status)
    VALUES (?, CURDATE(), ?)
  `;

  conn.query(sql, [nama_dosen, status], (err, result) => {
    if (err) {
      console.error('[x] DB ERROR tambahAktivitasDosen:', err);
      return res.status(500).json({ message: 'Gagal tambah data' });
    }
    console.log(`[+] Tambah aktivitas dosen ID ${result.insertId}`);
    res.json({ message: 'Berhasil tambah data', id: result.insertId });
  });
};

// Edit: hanya status
exports.editAktivitasDosen = (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: 'ID & status wajib diisi' });
  }

  const sql = `
    UPDATE aktivitas_ruang_dosen SET status = ?
    WHERE id = ?
  `;

  conn.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('[x] DB ERROR editAktivitasDosen:', err);
      return res.status(500).json({ message: 'Gagal update data' });
    }
    console.log(`[~] Update status aktivitas dosen ID ${id}`);
    res.json({ message: 'Berhasil update data' });
  });
};

// Hapus
exports.hapusAktivitasDosen = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  const sql = `DELETE FROM aktivitas_ruang_dosen WHERE id = ?`;

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[x] DB ERROR hapusAktivitasDosen:', err);
      return res.status(500).json({ message: 'Gagal hapus data' });
    }
    console.log(`[-] Hapus aktivitas dosen ID ${id}`);
    res.json({ message: 'Berhasil hapus data' });
  });
};
