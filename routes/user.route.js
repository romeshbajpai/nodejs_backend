const express = require("express");
const { register } = require("../controllers/user.controller");
const { registerValidation } = require("../validations/users.validation");
const userRouter = express.Router();
userRouter.route("/register").post(registerValidation,register);
module.exports = userRouter;