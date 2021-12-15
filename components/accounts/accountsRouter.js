const express = require('express');
const router = express.Router();
const accountsController = require('./accountsController');

router.get('/', accountsController.showPage);

module.exports = router;
