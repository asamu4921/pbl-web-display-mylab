const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sidebaradmin4Controller');

router.get('/', controller.getAktivitasLab);
router.get('/ruangan', controller.getRuangan);
router.post('/tambah', controller.tambahAktivitasLab);
router.post('/edit', controller.editAktivitasLab);
router.delete('/hapus/:id', controller.hapusAktivitasLab);

module.exports = router;
