const express = require('express');

const { RegisterModel, ProductModel } = require("../model");
const authRouter = express.Router();
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../../authValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  RegisterSchema,
  LoginSchema,
} = require("../validationSchema/authValidationSchema");
const authController=require("../controller/authController")
const secretKey=process.env.secret_key;

authRouter.post("/register" ,validationMiddleware(RegisterSchema), authController.registerUser
);

authRouter.post("/login" ,validationMiddleware(LoginSchema), 
authController.loginUser);


authRouter.post("/logout" ,authController.logoutUser);


module.exports = authRouter;