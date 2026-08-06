require("dotenv").config();
const express = require("express");
const connectDB = require("./connectDB");
const app=express();
const{RegisterModel,ProductModel}=require("./src/model");
const joi=require("joi");
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const authRouter = require("./src/routes/authroute");
const productRouter = require("./src/routes/productroute");
app.use(cookieParser());
app.use(express.json());
app.use("/auth" , authRouter);
 app.use("/product" , productRouter);
const authMiddleware=require("./authValidation");
const validationMiddleware= require("./src/middleware/validationMiddleware");
// const {RegisterSchema,LoginSchema}=require("./validationSchema/authValidationSchema");
const createProductSchema=require("./src/validationSchema/productValidationSchema");


 






connectDB()
  .then(() => {
    app.listen(3000, () => {
  console.log("server is running on port 3000");
});
  })
  .catch((err) => {
    console.log("database connection error", err);
  });