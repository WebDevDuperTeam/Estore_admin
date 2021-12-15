const express = require('express');
const router = express.Router();
const tablesController = require('./productsController');

router.get('/', tablesController.showPage);

module.exports = router;
