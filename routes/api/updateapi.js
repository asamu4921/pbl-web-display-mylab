const express = require('express');
const router = express.Router();
const controller = require('../../controllers/updateapi');

router.get('/updateapi', controller.updateAPI);
router.post('/edit', controller.editAPI);
router.delete('/delete/:id', controller.deleteAPI);

module.exports = router;
