const salesService = require('../services/salesService');
const httpStatus = require('../helpers/httpStatus');

const addSales = async (req, res, next) => {
  const salesProducts = req.body;
  
  const sale = await salesService.addSales(salesProducts);

  if (sale.error) return next(sale.error);

  res.status(httpStatus.created).json(sale);
};

module.exports = {
  addSales,
};
