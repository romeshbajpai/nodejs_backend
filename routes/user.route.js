const express = require("express");
const { register, login } = require("../controllers/user.controller");
const { registerValidation , loginValidation} = require("../validations/users.validation");


const userRouter = express.Router();
userRouter.route("/register").post(registerValidation,register);

userRouter.route("/login").post(loginValidation,login);

module.exports = userRouter;