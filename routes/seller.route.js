const express = require("express");
const { register,login} = require("../controllers/seller.controller");

const { registerValidation, loginValidation} = require("../validations/seller.validation");

const sellerAuthMiddleware = require("../middleware/auth");

const sellerRouter = express.Router();


sellerRouter.route("/login").post(loginValidation,login);
sellerRouter.route("/register").post(registerValidation,register);

module.exports = sellerRouter;