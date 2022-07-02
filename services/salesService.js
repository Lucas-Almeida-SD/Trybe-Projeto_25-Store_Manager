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

const validatesExistenceOfSale = (sales, saleId) => {
  const allExistingSalesIds = sales.map((sale) => sale.saleId);
  return allExistingSalesIds.includes(saleId);
};

const validatesExistenceOfTheproduct = (products, salesProducts) => {
  const allExistingProductIds = products.map((product) => product.id);
  const allSaleProductExist = salesProducts.every((saleProduct) => (
    allExistingProductIds.includes(saleProduct.productId)));
  return allSaleProductExist;
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

const getAll = async () => {
  const sales = await salesModel.getAll();

  return sales;
};

const getById = async (saleId) => {
  const sale = await salesModel.getById(saleId);

  if (!sale) return generateError('notFound', 'Sale not found');

  return sale;
};

const deleteSales = async (saleId) => {
  const sale = await salesModel.deleteSales(saleId);
  await salesModel.deleteSalesProducts(saleId);

  if (!sale) return generateError('notFound', 'Sale not found');

  return {};
};

const updateSalesProducts = async (saleId, salesProducts) => {
  const isSalesProductsValid = validateSalesProducts(salesProducts);
  if (isSalesProductsValid.error) return { error: isSalesProductsValid.error };
  
  const sales = await salesModel.getAll();
  if (!validatesExistenceOfSale(sales, saleId)) return generateError('notFound', 'Sale not found');
  
  const products = await productsModel.getAll();
  if (!validatesExistenceOfTheproduct(products, salesProducts)) {
    return generateError('notFound', 'Product not found');
  }
  
  await Promise.all(salesProducts.map((saleProduct) => (
    salesModel.updateSalesProducts(saleId, saleProduct.productId, saleProduct.quantity)
  )));

  return { saleId, itemsUpdated: salesProducts };
};

module.exports = {
  addSales,
  getAll,
  getById,
  deleteSales,
  updateSalesProducts,
};
