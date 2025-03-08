const express = require("express");
const { UpdateProduct, getAllProduct, getProduct, createProduct, deleteProduct } = require('../controllers/product.controller')
const { ValidateCreate } = require('../validations/product.validation')
const productRouter = express.Router();
const authMiddleware = require("../middleware/auth");

/**Product CRUD */
productRouter.route("/product-create").post(authMiddleware,  ValidateCreate, createProduct);
productRouter.route("/product-update/:id").post(authMiddleware,  UpdateProduct);
productRouter.route("/product-status-change/:id").post(authMiddleware,  UpdateProduct);
productRouter.route("/product-delete/:id").post(authMiddleware, deleteProduct);
productRouter.route("/product-list").get(getAllProduct);
productRouter.route("/product-details/:id").post(getProduct);



module.exports = productRouter;