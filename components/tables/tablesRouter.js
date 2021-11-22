const express = require('express');
const router = express.Router();
const tablesController = require('./tablesController');

router.get('/', tablesController.showPage);

module.exports = router;
