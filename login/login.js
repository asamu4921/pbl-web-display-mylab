const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // atau 'bcryptjs' kalau pakai itu

router.post('/', (req, res) => {
  const { nama, password } = req.body;

  const query = 'SELECT * FROM users WHERE nama = ? LIMIT 1';
  db.query(query, [nama], (err, results) => {
    if (err) {
      console.log('Query error:', err);
      return res.status(500).send('Error server');
    }

    if (results.length === 0) {
      console.log(`Login gagal: User ${nama} tidak ditemukan`);
      return res.redirect('/?error=Login gagal. Cek nama dan password.');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log('BCrypt error:', err);
        return res.status(500).send('Error bcrypt');
      }

      if (result) {
        console.log(`Login berhasil: ${nama}`);
        req.session.user = user;
        res.redirect('/dashboard');
      } else {
        console.log(`Login gagal: Password salah untuk user ${nama}`);
        res.redirect('/?error=Login gagal. Cek nama dan password.');
      }
    });
  });
});


module.exports = router;
