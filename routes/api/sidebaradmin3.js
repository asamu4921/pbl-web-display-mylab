// routes/api/sidebaradmin3.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sidebaradmin3Controller');

router.get('/', controller.getAktivitasDosen);
router.post('/tambah', controller.tambahAktivitasDosen);
router.post('/edit', controller.editAktivitasDosen);
router.delete('/hapus/:id', controller.hapusAktivitasDosen);

module.exports = router;
