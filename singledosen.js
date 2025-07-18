const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const conn = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ruangdosen_saif.html'));
});

// GET hanya data Saif
app.get('/api/aktivitas_dosen', (req, res) => {
  const sql = `SELECT * FROM aktivitas_ruang_dosen WHERE nama_dosen = 'Saif'`;
  conn.query(sql, (err, results) => {
    if (err) {
      console.log('❌ GET aktivitas_dosen SAIF error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ GET aktivitas_dosen SAIF OK');
    res.json(results);
  });
});

// POST data Saif
app.post('/api/aktivitas_dosen', (req, res) => {
  const { status } = req.body;
  const sql = `
    INSERT INTO aktivitas_ruang_dosen (nama_dosen, datetime, status)
    VALUES ('Saif', NOW(), ?)
  `;
  conn.query(sql, [status], (err, result) => {
    if (err) {
      console.log('❌ POST aktivitas_dosen SAIF error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ POST aktivitas_dosen SAIF =>', status);
    res.json({ id: result.insertId });
  });
});

// PUT status Saif
app.put('/api/aktivitas_dosen/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = `UPDATE aktivitas_ruang_dosen SET status=? WHERE id=? AND nama_dosen='Saif'`;
  conn.query(sql, [status, id], (err, result) => {
    if (err) {
      console.log('❌ PUT aktivitas_dosen SAIF error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ PUT aktivitas_dosen SAIF ID:', id, ' Status:', status);
    res.send('Status updated.');
  });
});

// DELETE hanya Saif
app.delete('/api/aktivitas_dosen/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM aktivitas_ruang_dosen WHERE id=? AND nama_dosen='Saif'`;
  conn.query(sql, [id], (err) => {
    if (err) {
      console.log('❌ DELETE aktivitas_dosen SAIF error:', err);
      return res.status(500).send(err);
    }
    console.log('✅ DELETE aktivitas_dosen SAIF ID:', id);
    res.send('Deleted.');
  });
});

app.listen(3000, () => console.log('Server ruang dosen SAIF di http://localhost:3000'));
