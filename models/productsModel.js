const connection = require('../helpers/connection');

const getAll = async () => {
  const query = `
    SELECT * FROM StoreManager.products
  `;

  const [products] = await connection.execute(query);

  return products;
};

const getById = async (id) => {
  const query = `
    SELECT * FROM StoreManager.products
    WHERE id = ?
  `;

  const [product] = await connection.execute(query, [id]);

  return product[0];
};

const addProduct = async (name) => {
  const query = `
    INSERT INTO StoreManager.products (name)
    VALUES (?)
  `;

  const [{ insertId: id }] = await connection.execute(query, [name]);

  return { id, name };
};

const updateProduct = async (id, name) => {
  const query = `
    UPDATE StoreManager.products
    SET name = ?
    WHERE id = ?
  `;

  const [{ affectedRows }] = await connection.execute(query, [name, id]);

  return affectedRows;
};

const deleteProducts = async (id) => {
  const query = `
    DELETE FROM StoreManager.products
    WHERE id = ?
  `;

  const [{ affectedRows }] = await connection.execute(query, [id]);

  return affectedRows;
};

const searchProduct = async (productName) => {
  const formatProductName = `%${productName}%`;
  
  const query = `
    SELECT * FROM StoreManager.products
    WHERE name LIKE ?;
    `;

  const [product] = await connection.execute(query, [formatProductName]);
  
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
