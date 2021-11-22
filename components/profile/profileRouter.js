const express = require('express');
const router = express.Router();
const profileController = require('./profileController');

router.get('/', profileController.showPage);

module.exports = router;
