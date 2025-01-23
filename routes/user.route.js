const express = require("express");
const { register, login, updateUser, getAllUser , getUser} = require("../controllers/user.controller");
const { registerValidation , loginValidation, updateUserValidation } = require("../validations/users.validation");


const userRouter = express.Router();

/**Sign up and Login */
userRouter.route("/register").post(registerValidation,register);

userRouter.route("/login-user").post(loginValidation,login);
userRouter.route("/login-seller").post(loginValidation,login);
userRouter.route("/login-admin").post(loginValidation,login);

/**USER CRUD */

userRouter.route("/user-update/:id").post(updateUserValidation, updateUser);
userRouter.route("/user-status-change/:id").post(updateUserValidation, updateUser);
// userRouter.route("/user-delete/:id").post(registerValidation, register);
userRouter.route("/user-list").get(getAllUser);
userRouter.route("/user-details/:id").post( getUser);
userRouter.route("/user-profile-update/:id").post(registerValidation, register);


module.exports = userRouter;