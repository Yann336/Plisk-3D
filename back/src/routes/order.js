const express = require('express');

const router = express.Router();

const orderController = require('../controllers/orderController');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.checkAuth, orderController.getOrders);

module.exports = router;
