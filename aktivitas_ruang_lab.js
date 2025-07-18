const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const conn = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'aktivitaslab.html'));
});

// Ambil data (filter ?nama=)
app.get('/api/aktivitas', (req, res) => {
  const nama = req.query.nama;
  let sql = 'SELECT * FROM aktivitas_ruang_lab';
  let params = [];
  if (nama) {
    sql += ' WHERE nama_laboran = ?';
    params.push(nama);
  }
  conn.query(sql, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Tambah data (NOW())
app.post('/api/aktivitas', (req, res) => {
  const { nama_laboran, status } = req.body;
  const sql = `
    INSERT INTO aktivitas_ruang_lab (nama_laboran, datetime, status)
    VALUES (?, NOW(), ?)
  `;
  conn.query(sql, [nama_laboran, status], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

// Edit status
app.put('/api/aktivitas/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = `UPDATE aktivitas_ruang_lab SET status=? WHERE id=?`;
  conn.query(sql, [status, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Status diupdate.');
  });
});

// Hapus data
app.delete('/api/aktivitas/:id', (req, res) => {
  const { id } = req.params;
  conn.query('DELETE FROM aktivitas_ruang_lab WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Data dihapus.');
  });
});

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
