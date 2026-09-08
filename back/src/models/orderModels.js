const db = require('../config/db');

const getOrdersIdsByUserId = async (idUser) => {
  const [result] = await db.query('SELECT id FROM orders WHERE id_users = ?', [idUser]);
  const resultArray = result.map((orderId) => orderId.id);
  return resultArray;
};

const createOrders = async (date, country, address, city, postalCode, totalPrice, idUser, conn) => {
  const [result] = await conn.query(`
    INSERT INTO orders(date_order, country, address, city, postal_code, total_price, id_users) 
    VALUES(?,?,?,?,?,?,?)`, [date, country, address, city, postalCode, totalPrice, idUser]);
  return result;
};

const createOrdersProducts = async (basketItems, idOrder, conn) => {
  const items = basketItems.map(() => '(?,?,?)').join(',');
  const sqlArray = basketItems.map((item) => [
    item.quantity, item.id, idOrder,
  ]).flat();
  const [result] = await conn.query(`
    INSERT INTO orders_products(quantity, id_products, id_orders) 
    VALUES ${items}`, sqlArray);
  return result;
};

const getOrderByIdUser = async (idUser) => {
  const [result] = await db.query(`
    SELECT orders.id, orders.date_order, orders.country, orders.address, orders.city, orders.postal_code, orders.total_price, orders_products.quantity, products.name, images.url 
    FROM orders 
    JOIN orders_products ON orders.id = orders_products.id_orders
    JOIN products ON products.id = orders_products.id_products 
    JOIN images ON products.id = images.id_products 
    WHERE orders.id_users = ?`, [idUser]);
  return result;
};

module.exports = {
  getOrdersIdsByUserId,
  createOrders,
  createOrdersProducts,
  getOrderByIdUser,
};
