const productsModel = require('../models/productsModel');
const generateError = require('../helpers/generateError');

const validateName = (name) => {
  if (!name) return generateError('badRequest', '"name" is required');

  if (name.length < 5) {
    return generateError('unprocessableEntity', '"name" length must be at least 5 characters long');
  }
  
  return {};
};

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
  const isNameValid = validateName(name);

  if (isNameValid.error) return { error: isNameValid.error };
  
  const product = await productsModel.addProduct(name);

  return product;
};

const updateProduct = async (id, name) => {
  const isNameValid = validateName(name);

  if (isNameValid.error) return { error: isNameValid.error };

  const productsExists = await productsModel.getById(id);

  if (!productsExists) return generateError('notFound', 'Product not found');

  await productsModel.updateProduct(id, name);

  return { id: Number(id), name };
};

const deleteProducts = async (id) => {
  const product = await productsModel.deleteProducts(id);

  if (!product) return generateError('notFound', 'Product not found');

  return {};
};

const searchProduct = async (productName) => {
  const product = (productName) ? (await productsModel.searchProduct(productName))
    : await productsModel.getAll();
  
  if (product.length === 0) return generateError('notFound', 'Product not found');
  
  return product;
};

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProducts,
  searchProduct,
};
