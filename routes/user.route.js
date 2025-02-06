const express = require("express");
const { register, login, updateUser, getAllUser , getUser} = require("../controllers/user.controller");
const { registerValidation , loginValidation, updateUserValidation } = require("../validations/users.validation");
const authMiddleware = require("../middleware/auth");

const userRouter = express.Router();

/**Sign up and Login */
userRouter.route("/register").post(registerValidation,register);

userRouter.route("/login-user").post(loginValidation,login);
// userRouter.route("/login-seller").post(loginValidation,login);
userRouter.route("/login-admin").post(loginValidation,login);

/**USER CRUD */

userRouter.route("/user-update/:id").post(authMiddleware, updateUserValidation, updateUser);
userRouter.route("/user-status-change/:id").post(authMiddleware, updateUserValidation, updateUser);
// userRouter.route("/user-delete/:id").post(registerValidation, register);
userRouter.route("/user-list").get(authMiddleware, getAllUser);
userRouter.route("/user-details/:id").post(authMiddleware, getUser);
userRouter.route("/user-profile-update/:id").post(authMiddleware, registerValidation, register);


module.exports = userRouter;