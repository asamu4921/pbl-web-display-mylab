const conn = require('../db');

const mapping = {
  'Ahmad Saif Almuflihin': 'RTF.IV.4',
  'sule': 'RTF.IV.2',
  'samurai': 'RTF.IV.1',
  'uriel': 'RTF.III.6',
  'polnarev': 'GU 601',
  'Banu Failasuf, S.Tr': 'GU 805',
  'Agus Riady, A.Md.Kom': 'GU 705',
  'Supardianto, S.ST.M.Eng.': 'RTF.V.1',
  'Sartikha, S. ST., M.Eng': 'TA.XII.4',
  'Eko Wijaya, S.Kom': 'GU.601',
  'Sari Purnama, M.Sn': 'GU.604',
  'Bagas Permana, S.T': 'GU.606',
  'Dewi Kartika, M.Kom': 'GU.607',
  'Yusuf Maulana, S.Sn': 'GU.608',
  'Ratna Dewi, S.Kom': 'GU.702',
  'Putri Astuti, M.T': 'GU.704',
  'Fajar Nugraha, M.Sn': 'GU.706',
  'Hendra Saputra, S.Sn': 'GU.707',
  'Sri Handayani, M.Sc': 'RTF.III.1',
  'Gilang Ramadhan, S.I.Kom': 'RTF.III.3',
  'Nina Lestari, S.Kom': 'RTF.V.2',
  'Indah Pratiwi, M.Eng': 'RTF.V.4',
  'Andi Pratama, S.Kom': 'TA.X.3',
  'Mega Sari, M.Kom': 'TA.X.4',
  'Arief Budiman, M.Kom': 'TA.XI.3',
  'Rina Puspita, M.T': 'TA.XI.4a',
  'Miftahul Jannah, S.Kom': 'TA.XI.5',
  'Ilham Fauzi, M.Kom': 'TA.XII.2',
  'Zaki Ramadhan, M.T': 'TA.XII.3A',
  'Yulia Rahmawati, M.Kom': 'TA.XII.3B',
  'Baginda Putra, S.T': 'TP 302',
  'Rafli Maulana, S.Sn': 'TP 304',
  'Kokusibo, S.Sn': 'TP 305'
};

exports.getAktivitasLab = (req, res) => {
  const kode = req.query.kode_ruangan;
  let laboranList = [];

  if (!kode) {
    laboranList = Object.keys(mapping);
  } else {
    for (const [nama, ruangan] of Object.entries(mapping)) {
      if (ruangan === kode) laboranList.push(nama);
    }
    if (laboranList.length === 0) return res.json({ rows: [] });
  }

  const sql = `SELECT * FROM aktivitas_ruang_lab WHERE nama_laboran IN (?)`;
  conn.query(sql, [laboranList], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB ERROR' });
    }
    res.json({ rows, laboranList: Object.keys(mapping) });
  });
};

exports.getRuangan = (req, res) => {
  conn.query(
    'SELECT DISTINCT kode_ruangan, nama_ruangan FROM api ORDER BY kode_ruangan',
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB ERROR' });
      }
      res.json(rows);
    }
  );
};

// [POST] Tambah aktivitas laboran
exports.tambahAktivitasLab = (req, res) => {
  const { nama_laboran, status } = req.body;

  if (!nama_laboran || !status) {
    return res.status(400).json({ message: 'Nama dan Status wajib diisi' });
  }

  if (!Object.keys(mapping).includes(nama_laboran)) {
    return res.status(400).json({ message: 'Nama laboran tidak valid' });
  }

  const sql = `INSERT INTO aktivitas_ruang_lab (nama_laboran, datetime, status) VALUES (?, NOW(), ?)`;
  conn.query(sql, [nama_laboran, status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal tambah data' });
    }
    res.json({ message: 'Tambah data berhasil' });
  });
};

// [POST] Edit status
exports.editAktivitasLab = (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: 'ID dan Status wajib diisi' });
  }

  const sql = `UPDATE aktivitas_ruang_lab SET status = ? WHERE id = ?`;
  conn.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal update data' });
    }
    res.json({ message: 'Update berhasil' });
  });
};

// [DELETE] Hapus aktivitas
exports.hapusAktivitasLab = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID wajib diisi' });
  }

  const sql = `DELETE FROM aktivitas_ruang_lab WHERE id = ?`;
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal hapus data' });
    }
    res.json({ message: 'Hapus berhasil' });
  });
};
