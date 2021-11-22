const express = require('express');
const router = express.Router();
const signController = require('./signController');

router.get('/', signController.showSignInPage);

module.exports = router;
