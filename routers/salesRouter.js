const express = require('express');
const rescue = require('express-rescue');
const salesController = require('../controllers/salesController');

const router = express.Router();

router.get('/', rescue(salesController.getAll));
router.get('/:id', rescue(salesController.getById));
router.post('/', rescue(salesController.addSales));
router.put('/:id', rescue(salesController.updateSalesProducts));
router.delete('/:id', rescue(salesController.deleteSales));

module.exports = router;
