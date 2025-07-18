const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sidebaradmin5Controller');

router.get('/', controller.getUsers);
router.post('/tambah', controller.tambahUser);
router.post('/edit', controller.editUser);
router.delete('/hapus/:id', controller.hapusUser);

module.exports = router;
