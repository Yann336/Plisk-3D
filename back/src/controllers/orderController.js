const orderModel = require('../models/orderModels');

const createRes = (resModel) => {
  const orders = {};
  resModel.forEach((element) => {
    if (!orders[element.id]) {
      orders[element.id] = {
        country: element.country,
        address: element.address,
        city: element.city,
        postalCode: element.postal_code,
        date_order: element.date_order,
        total_price: element.total_price,
        products: [
          { quantity: element.quantity, name: element.name, url: element.url },
        ],
      };
    } else {
      orders[element.id].products.push({
        quantity: element.quantity,
        name: element.name,
        url: element.url,
      });
    }
  });
  const ordersArray = Object.values(orders);
  return ordersArray;
};

const getOrders = async (req, res) => {
  try {
    const resModel = await orderModel.getOrderByIdUser(req.idUser);
    if (resModel.length !== 0) {
      const orders = createRes(resModel);
      return res.status(200).json(orders);
    }
    return res.status(200).json({ message: 'Il n y a aucune commande' });
  } catch (error) {
    return res.status(500).json({ message: 'une erreur est survenue', error: error.message });
  }
};

module.exports = {
  getOrders,
};
