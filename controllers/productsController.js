const productsService = require('../services/productsService');
const httpStatus = require('../helpers/httpStatus');

const getAll = async (_req, res) => {
  const products = await productsService.getAll();

  res.status(httpStatus.ok).json(products);
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  const product = await productsService.getById(id);

  if (product.error) return next(product.error);

  res.status(httpStatus.ok).json(product);
};

const addProduct = async (req, res, next) => {
  const { name } = req.body;

  const product = await productsService.addProduct(name);

  if (product.error) return next(product.error);

  res.status(httpStatus.created).json(product);
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const product = await productsService.updateProduct(id, name);

  if (product.error) return next(product.error);

  res.status(httpStatus.ok).json(product);
};

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
};
