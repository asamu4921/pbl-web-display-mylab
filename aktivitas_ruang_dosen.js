const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const conn = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'aktivitasdosen.html'));
});

// GET aktivitas ruang dosen by grup
app.get('/api/aktivitas_dosen', (req, res) => {
  const grup = req.query.grup;
  let dosenList = [];

  if (grup === 'ruangdosen1') dosenList = ['wali', 'ridho', 'saif'];
  else if (grup === 'ruangdosen2') dosenList = ['grecia', 'kavit', 'nuryanti'];
  else if (grup === 'ruangdosen3') dosenList = ['naurah', 'jokowi', 'mpleh'];
  else {
    console.log('❌ GET aktivitas_dosen => grup tidak valid:', grup);
    return res.status(400).send('Grup tidak valid');
  }

  const sql = `SELECT * FROM aktivitas_ruang_dosen WHERE nama_dosen IN (?)`;
  conn.query(sql, [dosenList], (err, results) => {
    if (err) {
      console.log('❌ GET aktivitas_dosen error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ GET aktivitas_dosen =>', grup);
    res.json(results);
  });
});

// POST tambah aktivitas dosen (NOW)
app.post('/api/aktivitas_dosen', (req, res) => {
  const { nama_dosen, status } = req.body;
  const sql = `
    INSERT INTO aktivitas_ruang_dosen (nama_dosen, datetime, status)
    VALUES (?, NOW(), ?)
  `;
  conn.query(sql, [nama_dosen, status], (err, result) => {
    if (err) {
      console.log('❌ POST aktivitas_dosen error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ POST aktivitas_dosen =>', nama_dosen, status);
    res.json({ id: result.insertId });
  });
});

// PUT edit status
app.put('/api/aktivitas_dosen/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = `UPDATE aktivitas_ruang_dosen SET status=? WHERE id=?`;
  conn.query(sql, [status, id], (err) => {
    if (err) {
      console.log('❌ PUT aktivitas_dosen error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ PUT aktivitas_dosen => ID:', id, ' Status:', status);
    res.send('Status updated.');
  });
});

// DELETE aktivitas dosen
app.delete('/api/aktivitas_dosen/:id', (req, res) => {
  const { id } = req.params;
  conn.query('DELETE FROM aktivitas_ruang_dosen WHERE id=?', [id], (err) => {
    if (err) {
      console.log('❌ DELETE aktivitas_dosen error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ DELETE aktivitas_dosen => ID:', id);
    res.send('Deleted.');
  });
});

app.listen(3000, () => console.log('Server ruang dosen jalan di http://localhost:3000'));
