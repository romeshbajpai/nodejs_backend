const express = require("express");
const { UpdateProduct, getAllProduct, getProduct, deleteProduct } = require('../controllers/product.controller')

const productRouter = express.Router();
const authMiddleware = require("../middleware/auth");

/**Product CRUD */

productRouter.route("/product-update/:id").post(authMiddleware,  UpdateProduct);
productRouter.route("/product-status-change/:id").post(authMiddleware,  UpdateProduct);
productRouter.route("/product-delete/:id").post(authMiddleware, deleteProduct);
productRouter.route("/product-list").get(getAllProduct);
productRouter.route("/product-details/:id").post(getProduct);



module.exports = productRouter;