const db = require('../config/db');

const getBasketIdByUserId = async (idUser) => {
  const [result] = await db.query('SELECT id FROM baskets WHERE id_users = ?', [idUser]);
  return result;
};

const createBasket = async (idUser) => {
  const [result] = await db.query(`
    INSERT INTO baskets(id_users) 
    VALUES(?)`, [idUser]);
  return result;
};

const getBasket = async (idUser) => {
  const [result] = await db.query(`
    SELECT products.id, products.name, products.price, baskets_products.quantity, images.url 
    FROM baskets 
    JOIN baskets_products ON baskets.id = baskets_products.id_baskets 
    JOIN products ON products.id = baskets_products.id_products 
    JOIN images ON products.id = images.id_products 
    WHERE baskets.id_users = ?`, [idUser]);
  return result;
};

const checkProductsInBasketsExists = async (idProducts, idBaskets) => {
  const [result] = await db.query(`
    SELECT quantity
    FROM baskets_products
    WHERE id_products = ? AND id_baskets = ?`, [idProducts, idBaskets]);
  return result;
};

const insertProductInBasket = async (idProducts, idBaskets) => {
  const [result] = await db.query(`
    INSERT INTO baskets_products(quantity, id_products, id_baskets)
    VALUES (?, ?, ?)`, [1, idProducts, idBaskets]);
  return result;
};

const updateQuantityByIdProductsAndIdBaskets = async (quantity, idProducts, idBaskets) => {
  const [result] = await db.query(`
    UPDATE baskets_products
    SET quantity = ? 
    WHERE id_products = ? AND id_baskets = ?`, [quantity, idProducts, idBaskets]);
  return result;
};

const deleteProductsInBaskets = async (idProducts, idBaskets) => {
  const [result] = await db.query(`
    DELETE FROM baskets_products
    WHERE id_products = ? AND id_baskets = ?`, [idProducts, idBaskets]);
  return result;
};

const deleteAllItemsInBasket = async (idBaskets, conn) => {
  const [result] = await conn.query(`
    DELETE FROM baskets_products
    WHERE id_baskets = ?`, [idBaskets]);
  return result;
};

module.exports = {
  createBasket,
  getBasketIdByUserId,
  getBasket,
  checkProductsInBasketsExists,
  insertProductInBasket,
  updateQuantityByIdProductsAndIdBaskets,
  deleteProductsInBaskets,
  deleteAllItemsInBasket,
};
