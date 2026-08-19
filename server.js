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
const multer=require("multer");
const path =require('path');
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
const addressRouter=require("./src/routes/addressroute");
const uploadBuffer = require("./src/utils/uploadBuffer");
const { message } = require("./src/validationSchema/addressValidationSchema");
app.use("/address",addressRouter);
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
  fields:2
}});


// const diskStorage=multer.diskStorage({
//   destination:function(req,file,cb){
//     cb(null,"uploads/");
//   },

//   filename:function(req,file,cb){
//     const ext=path.extname(file.originalname);
//     const unique=Date.now()+"-"+Math.round(Math.random()*1e9);
//     cb(null,unique+ext);
//   },
// })


app.use("/imageUpload",upload.single("avatar"),(req,res)=>{
  const imageURL=  req.files.map((file)=>{ 
     console.log(req.files,"req file details");
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  }) 
  
  
 
  res.send({imageURL:imageURL,
  message:"image upload"
  })
})


app.post("/upload/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }
  

     return res.status(200).json({
      message: "Image uploaded successfully",
      image: result,
    });

  } catch (err) {
   
  return res.status(500).json({
      message: err.message,
    });
  }
});



connectDB()
  .then(() => {
    app.listen(3000, () => {
  console.log("server is running on port 3000");
});
  })
  .catch((err) => {
    console.log("database connection error", err);
  });