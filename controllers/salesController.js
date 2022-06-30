const salesService = require('../services/salesService');
const httpStatus = require('../helpers/httpStatus');

const addSales = async (req, res, next) => {
  const salesProducts = req.body;
  
  const sale = await salesService.addSales(salesProducts);

  if (sale.error) return next(sale.error);

  res.status(httpStatus.created).json(sale);
};

const getAll = async (_req, res) => {
  const sales = await salesService.getAll();

  res.status(httpStatus.ok).json(sales);
};

const getById = async (req, res, next) => {
  const { id: saleId } = req.params;

  const sale = await salesService.getById(saleId);

  if (sale.error) return next(sale.error);

  res.status(httpStatus.ok).json(sale);
};

module.exports = {
  addSales,
  getAll,
  getById,
};
