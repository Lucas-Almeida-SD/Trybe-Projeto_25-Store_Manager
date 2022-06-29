const productsModel = require('../models/productsModel');
const generateError = require('../helpers/generateError');

const getAll = async () => {
  const product = await productsModel.getAll();

  return product;
};

const getById = async (id) => {
  const product = await productsModel.getById(id);

  if (!product) return generateError('notFound', 'Product not found');

  return product;
};

const addProduct = async (name) => {
  const product = await productsModel.addProduct(name);

  return product;
};

module.exports = {
  getAll,
  getById,
  addProduct,
};
