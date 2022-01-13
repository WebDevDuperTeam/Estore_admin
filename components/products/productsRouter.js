const express = require('express');
const router = express.Router();
const productsController = require('./productsController');

router.get('/', productsController.showPage);
router.post('/', productsController.postProduct);

module.exports = router;
