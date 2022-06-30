const express = require('express');
const rescue = require('express-rescue');
const salesController = require('../controllers/salesController');

const router = express.Router();

router.post('/', rescue(salesController.addSales));

module.exports = router;
