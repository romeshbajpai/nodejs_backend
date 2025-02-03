const express = require("express");
const { UpdateCategory, getAllCategory, getCategory, deleteCategory} = require('../controllers/category.controller')

const categoryRouter = express.Router();
const authMiddleware = require("../middleware/auth");

/**Product CRUD */

categoryRouter.route("/category-update/:id").post(authMiddleware,  UpdateCategory);
categoryRouter.route("/category-status-change/:id").post(authMiddleware,  UpdateCategory);
categoryRouter.route("/category-delete/:id").post(authMiddleware, deleteCategory);
categoryRouter.route("/category-list").get(getAllCategory);
categoryRouter.route("/category-details/:id").post(getCategory);



module.exports = categoryRouter;