const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const db = require('./db');
// server.js
const sidebarHeader = require('./sidebar/header');
const sidebarFooter = require('./sidebar/footer');
const sidebarLeftside = require('./sidebar/leftside');

app.use('/sidebar/header', sidebarHeader);
app.use('/sidebar/footer', sidebarFooter);
app.use('/sidebar/leftside', sidebarLeftside);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/dataset', express.static(path.join(__dirname, 'dataset')));

app.use(session({
  secret: 'rahasia_sessionmu',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,         // FALSE karena tidak pakai HTTPS
    sameSite: 'lax'         // Izinkan akses dari IP/domain berbeda tapi masih lokal
    // domain: undefined    // JANGAN ditetapkan agar berlaku ke semua host lokal
  }
}));


// Middleware: Cek login
function cekLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// Route publik
app.use('/', require('./halamanawal'));
app.use('/login', require('./login/login'));
app.use('/login', require('./login/logout'));

// Route privat
app.use('/dashboard', cekLogin, require('./dashboard/admin'));
app.use('/dashboard', cekLogin, require('./dashboard/dosen'));
app.use('/dashboard', cekLogin, require('./dashboard/laboran'));
app.use('/sidebar', cekLogin, require('./sidebar/header'));
app.use('/sidebar', cekLogin, require('./sidebar/footer'));
app.use('/sidebar', cekLogin, require('./sidebar/leftside'));
app.use('/users', cekLogin, require('./users/indeks'));
app.use('/users', cekLogin, require('./users/create'));
app.use('/users', cekLogin, require('./users/edit'));
app.use('/users', cekLogin, require('./users/update'));
app.use('/users', cekLogin, require('./users/delete'));
app.use('/api', cekLogin, require('./api/indeks'));
app.use('/api', cekLogin, require('./api/create'));
app.use('/api', cekLogin, require('./api/edit'));
app.use('/api', cekLogin, require('./api/update'));
app.use('/api', cekLogin, require('./api/delete'));
app.use('/matkul', cekLogin, require('./matkul/indeks'));
app.use('/matkul', cekLogin, require('./matkul/create'));
app.use('/matkul', cekLogin, require('./matkul/edit'));
app.use('/matkul', cekLogin, require('./matkul/update'));
app.use('/matkul', cekLogin, require('./matkul/delete'));
app.use('/lab', cekLogin, require('./lab/rtf.iv.4'));
app.use('/lab', cekLogin, require('./lab/create.rtf.iv.4'));
app.use('/lab', cekLogin, require('./lab/delete.rtf.iv.4'));
app.use('/lab', cekLogin, require('./lab/edit.rtf.iv.4'));
app.use('/dosen', cekLogin, require('./dosen/ruangdosen1'));
app.use('/dosen', cekLogin, require('./dosen/create.ruangdosen1'));
app.use('/dosen', cekLogin, require('./dosen/delete.ruangdosen1'));
app.use('/dosen', cekLogin, require('./dosen/edit.ruangdosen1'));
app.use('/jadwalmatkul', cekLogin, require('./jadwalmatkul/rtf.iv.4'));
app.use('/jadwalmatkul', cekLogin, require('./jadwalmatkul/create.rtf.iv.4'));
app.use('/jadwalmatkul', cekLogin, require('./jadwalmatkul/edit.rtf.iv.4'));
app.use('/jadwalmatkul', cekLogin, require('./jadwalmatkul/delete.rtf.iv.4'));




const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
    console.log(`Akses dari HP: http://10.241.130.19:${PORT}`);
});

