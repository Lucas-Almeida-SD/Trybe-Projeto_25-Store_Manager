const connection = require('../helpers/connection');

const addSales = async () => {
  const saleQuery = 'INSERT INTO StoreManager.sales () VALUES ()';

  const [{ insertId: saleId }] = await connection.execute(saleQuery);

  return saleId;
};

const addSalesProducts = async (saleId, salesProducts) => {
  await Promise.all(salesProducts.map((sale) => {
    const { productId, quantity } = sale;

    const salePoductQuery = `
      INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
      VALUES (?, ?, ?)
    `;
    
    return connection.execute(salePoductQuery, [saleId, productId, quantity]);
  }));
};

const getAll = async () => {
  const query = `
    SELECT
      sales.id AS saleId,
      sales.date,
      sales_products.product_id AS productId,
      sales_products.quantity
    FROM StoreManager.sales AS sales
    INNER JOIN StoreManager.sales_products AS sales_products
    ON sales.id = sales_products.sale_id
  `;

  const [sales] = await connection.execute(query);

  return sales;
};

const getById = async (saleId) => {
  const query = `
    SELECT
      sales.date,
      sales_products.product_id AS productId,
      sales_products.quantity
    FROM StoreManager.sales AS sales
    INNER JOIN StoreManager.sales_products AS sales_products
    ON sales.id = sales_products.sale_id
    WHERE id = ?
  `;

  const [sale] = await connection.execute(query, [saleId]);

  if (sale.length === 0) return undefined;

  return sale;
};

module.exports = {
  addSales,
  addSalesProducts,
  getAll,
  getById,
};
