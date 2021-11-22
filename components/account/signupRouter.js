const express = require('express');
const router = express.Router();
const signController = require('./signController');

router.get('/', signController.showSignUpPage);

module.exports = router;
