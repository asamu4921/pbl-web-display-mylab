const express = require('express');
const router = express.Router();
const controller = require('../../controllers/sidebarlaboran4Controller');

router.get('/', controller.getRuangLab);

module.exports = router;
