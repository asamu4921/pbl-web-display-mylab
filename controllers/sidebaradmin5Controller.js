const conn = require('../db');

exports.getUsers = (req, res) => {
  const role = req.query.role;
  let sql = `SELECT * FROM users`;
  const params = [];

  if (role && role !== 'all') {
    sql += ` WHERE role = ?`;
    params.push(role);
  }

  conn.query(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB ERROR' });
    }
    res.json(rows);
  });
};

const bcrypt = require('bcrypt'); // taruh paling atas

exports.tambahUser = async (req, res) => {
  const { role, nama, foto, password } = req.body;

  if (!role || !nama || !password) {
    return res.status(400).json({ error: 'Role, nama, dan password wajib diisi' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (role, nama, foto, password) VALUES (?, ?, ?, ?)`;
    conn.query(sql, [role, nama, foto, hash], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB ERROR' });
      }
      res.json({ message: 'User berhasil ditambah' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hash ERROR' });
  }
};



exports.editUser = async (req, res) => {
  const { id, role, nama, foto, password } = req.body;

  if (!id || !role || !nama) {
    return res.status(400).json({ error: 'ID, role, dan nama wajib diisi' });
  }

  try {
    let sql, params;

    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      sql = `UPDATE users SET role = ?, nama = ?, foto = ?, password = ? WHERE id = ?`;
      params = [role, nama, foto, hash, id];
    } else {
      sql = `UPDATE users SET role = ?, nama = ?, foto = ? WHERE id = ?`;
      params = [role, nama, foto, id];
    }

    conn.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB ERROR' });
      }
      res.json({ message: 'User berhasil diupdate' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hash ERROR' });
  }
};


// ✅ HAPUS USER
exports.hapusUser = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: 'ID wajib diisi' });

  const sql = `DELETE FROM users WHERE id = ?`;
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('[x] Gagal hapus:', err);
      return res.status(500).json({ message: 'Gagal hapus user' });
    }
    console.log(`[-] User ID ${id} dihapus`);
    res.json({ message: 'Hapus user berhasil' });
  });
};
