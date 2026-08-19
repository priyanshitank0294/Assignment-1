const express = require('express');

const { RegisterModel, ProductModel } = require("../model");
const authRouter = express.Router();
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../../authValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshKey=process.env.refresh_key;
const accessKey=process.env.access_key;
const multer=require("multer");
const path =require('path');
const allowed=["image/jpeg","image/png","image/webp"];
const fileFilter=(req,file,cb)=>{
  if(allowed.includes(file.mimetype)){
    cb(null,true)
  }
  else{
    cb(new Error("Only jpg ,png,webp allowed "),false);
  }
}

const upload=multer({storage:multer.memoryStorage(),fileFilter,limits:{
  fileSize:2*1024*1024,  //2 MB
  files:1,
  fields:6
}});

const {
  RegisterSchema,
  LoginSchema,
} = require("../validationSchema/authValidationSchema");
const authController=require("../controller/authController")
const secretKey=process.env.secret_key;

authRouter.post("/register" ,upload.single("userPhoto"),validationMiddleware(RegisterSchema), authController.registerUser
);

authRouter.post("/login" ,validationMiddleware(LoginSchema), 
authController.loginUser);


authRouter.post("/logout" ,authController.logoutUser);

//refresh token api
authRouter.get("/refreshToken",async(req,res)=>{
const refreshToken=req.cookies.refreshtoken;
if(!refreshToken)
 { res.send("Token not found,login again");
}
const decoded=jwt.verify(refreshToken,refreshKey);
const newAccessToken =jwt.sign({id:decoded.id},accessKey,{expiresIn:"2m"})
res.cookie("givenToken",newAccessToken,{httpOnly:true});
    res.cookie("refreshtoken",refreshToken,{httpOnly:true})
    res.send("new access token created");
})



module.exports = authRouter;