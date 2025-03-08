const express = require("express");
const { register, login, updateUser, getAllUser , getUser} = require("../controllers/user.controller");
const { validateRegister , validateLogin, validateUpdate } = require("../validations/users.validation");
const authMiddleware = require("../middleware/auth");

const userRouter = express.Router();

/**Sign up and Login */
userRouter.route("/register").post(validateRegister, register);

userRouter.route("/login-user").post(validateLogin,login);
// userRouter.route("/login-seller").post(loginValidation,login);
userRouter.route("/login-admin").post(validateLogin,login);

/**USER CRUD */

userRouter.route("/user-update/:id").post(authMiddleware, validateUpdate, updateUser);
userRouter.route("/user-status-change/:id").post(authMiddleware, validateUpdate, updateUser);
// userRouter.route("/user-delete/:id").post(registerValidation, register);
userRouter.route("/user-list").get(authMiddleware, getAllUser);
userRouter.route("/user-details/:id").post(authMiddleware, getUser);
userRouter.route("/user-profile-update/:id").post(authMiddleware, validateRegister, register);


module.exports = userRouter;