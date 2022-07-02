const express = require('express');
const rescue = require('express-rescue');
const productsController = require('../controllers/productsController');

const router = express.Router();

router.get('/', rescue(productsController.getAll));
router.get('/search', rescue(productsController.searchProduct));
router.get('/:id', rescue(productsController.getById));
router.post('/', rescue(productsController.addProduct));
router.put('/:id', rescue(productsController.updateProduct));
router.delete('/:id', rescue(productsController.deleteProducts));

module.exports = router;
