const express = require("express");
const { UpdateProduct, getAllProduct, getProduct, deleteProduct } = require('../controllers/product.controller')

const productRouter = express.Router();

/**Product CRUD */

productRouter.route("/product-update/:id").post(updateUserValidation, UpdateProduct);
productRouter.route("/product-status-change/:id").post(updateUserValidation, UpdateProduct);
productRouter.route("/product-delete/:id").post(deleteProduct, register);
productRouter.route("/product-list").get(getAllProduct);
productRouter.route("/product-details/:id").post(getProduct);



module.exports = productRouter;