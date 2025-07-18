const rateLimit = require('express-rate-limit');
const express = require('express');
const session = require('express-session');
const loginRoutes = require('./routes/auth/login');
const logoutRoutes = require('./routes/auth/logout');
const logger = require('./middleware/logger');
const path = require('path');

// Routes
const sidebarDosen1Routes = require('./routes/api/sidebardosen1');
const sidebarDosen2Routes = require('./routes/api/sidebardosen2');
const sidebarLaboran1Routes = require('./routes/api/sidebarlaboran1');
const sidebarLaboran2Routes = require('./routes/api/sidebarlaboran2');
const sidebarLaboran3Routes = require('./routes/api/sidebarlaboran3');
const sidebarLaboran4Routes = require('./routes/api/sidebarlaboran4');
const updateAPIRoutes = require('./routes/api/updateapi');
const sidebarAdmin2Routes = require('./routes/api/sidebaradmin2');
const sidebarAdmin3Routes = require('./routes/api/sidebaradmin3');
const sidebarAdmin4Routes = require('./routes/api/sidebaradmin4');
const sidebarAdmin5Routes = require('./routes/api/sidebaradmin5');

// === Rate limit ===
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Terlalu banyak permintaan, coba lagi nanti.'
});

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Terlalu banyak percobaan login. Coba lagi nanti.'
});

const app = express();

// Body parser & session
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'rahasia_mantap',
  resave: false,
  saveUninitialized: true
}));

// === Pasang limiter ===
app.use('/api', apiLimiter);
app.use('/login', loginLimiter);

// Logger
app.use(logger);

// Static files
app.use(express.static(path.join(__dirname, 'views')));

// === Routes API ===
app.use('/api/sidebardosen1', sidebarDosen1Routes);
app.use('/api/sidebardosen2', sidebarDosen2Routes);
app.use('/api/sidebarlaboran1', sidebarLaboran1Routes);
app.use('/api/sidebarlaboran2', sidebarLaboran2Routes);
app.use('/api/sidebarlaboran3', sidebarLaboran3Routes);
app.use('/api/sidebarlaboran4', sidebarLaboran4Routes);
app.use('/api/updateapi', updateAPIRoutes);
app.use('/api/admin/sidebar2', sidebarAdmin2Routes);
app.use('/api/admin/sidebar3', sidebarAdmin3Routes);
app.use('/api/admin/sidebar4', sidebarAdmin4Routes);
app.use('/api/admin/sidebar5', sidebarAdmin5Routes);

// === Auth routes ===
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

// === Views ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/dosen', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'dosen') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'views', 'dosen.html'));
});

app.get('/laboran', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'laboran') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'views', 'laboran.html'));
});

app.get('/superadmin', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'superadmin') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ nama: req.session.user.nama, role: req.session.user.role });
});

// Listen
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
