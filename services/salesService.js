const salesModel = require('../models/salesModel');
const productsModel = require('../models/productsModel');
const generateError = require('../helpers/generateError');

const validateSalesProducts = (salesProducts) => {
  switch (true) {
    case salesProducts.some((sale) => !sale.productId):
      return generateError('badRequest', '"productId" is required');
    case salesProducts.some((sale) => !sale.quantity && sale.quantity !== 0):
      return generateError('badRequest', '"quantity" is required');
    case salesProducts.some((sale) => sale.quantity <= 0):
      return generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');
    default:
      return {};
  }
};

const addSales = async (salesProducts) => {
  const isSalesProductsValid = validateSalesProducts(salesProducts);

  if (isSalesProductsValid.error) return { error: isSalesProductsValid.error };

  const getProducts = await Promise.all(
    salesProducts.map((product) => productsModel.getById(product.productId)),
  );

  if (getProducts.some((product) => !product)) {
    return generateError('notFound', 'Product not found');
  }

  const saleId = await salesModel.addSales();

  await salesModel.addSalesProducts(saleId, salesProducts);

  return { id: saleId, itemsSold: salesProducts };
};

module.exports = {
  addSales,
};
