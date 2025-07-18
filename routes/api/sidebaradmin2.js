const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sidebaradmin2Controller');

router.get('/', controller.getJadwal);
router.get('/ruangan', controller.getRuanganList);

router.post('/tambah', controller.createJadwal);
router.post('/edit', controller.editJadwal);
router.delete('/hapus/:id', controller.deleteJadwal);

module.exports = router;
