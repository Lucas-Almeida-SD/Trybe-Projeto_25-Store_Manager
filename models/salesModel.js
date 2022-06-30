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

module.exports = {
  addSales,
  addSalesProducts,
};
