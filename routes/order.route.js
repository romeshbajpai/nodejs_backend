const express = require("express");
const { createOrder,orderStats} = require('../controllers/order.controller');

const orderRouter = express.Router();
const authMiddleware = require('../middleware/auth')


orderRouter.route("/order-create").post(authMiddleware,  createOrder);
orderRouter.route("/order-stats-report").get(authMiddleware,  orderStats)

module.exports = orderRouter;