const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest:'uploads/'});
const productsController = require('./productsController');

router.get('/', productsController.showPage);
router.post('/', productsController.postProduct);
router.post('/upload', upload.single('file'), productsController.uploadImage);

module.exports = router;
