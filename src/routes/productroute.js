const express = require("express");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../../authValidation");
const {
  createProductSchema
  
} = require("../validationSchema/productValidationSchema");
const {RegisterModel , ProductModel} = require("../model");
const { default: mongoose } = require("mongoose");
const productRouter = express.Router();
const productController = require("../controller/productController");

productRouter.post("/createProduct" ,authMiddleware, validationMiddleware(createProductSchema), productController.createProduct);

productRouter.get("/getProduct" , authMiddleware , async (req,res)=>{
    try{
        const {page, limit , sort ="ASC"} = req.query;
    let allProduct =  await ProductModel.find({})
      .skip((page-1)*limit)
      .select("-description")
      .limit(limit)
      .sort(sort);
      
      res.json(allProduct);
    }
    catch(err){
        console.log(error);
    }
});

productRouter.get("/getSingleProduct/:id" , authMiddleware , async(req,res)=>{
try{
 const id = req.params.id;
 if(!mongoose.isValidObjectId(id)){
  return  res.status(400).send("invalid id..");
 }
  let singleProduct = await ProductModel.findById(id);

  if(!singleProduct){
   return res.status(404).send("product don't exist");
  }

  res.json(singleProduct);
}
catch(err){
    console.log(err);
}
});

productRouter.patch("/updateSingleProduct/:id" , authMiddleware , async (req,res)=>{
    try{
     const id = req.params.id;
     if(!mongoose.isValidObjectId(id)){
       return res.status(400).send("invalid Id");
    }

    const productExist = await ProductModel.findById(id);

    if(!productExist){
     return   res.status(404).send("Product not found.");
    }
    await ProductModel.findByIdAndUpdate(id , req.body , {
     returnDocument : "after",
     runValidators:true,
    });
    res.status(200).send("Product updated successfully");
    }
    catch(err){
        console.log(error);
    }
});

productRouter.delete("/deleteProduct/:id" , authMiddleware , async (req,res)=>{
    try{
    const id = req.params.id ;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send("Invalid Id..");
    }
    const productExist = await ProductModel.findById(id);
    if(!productExist){
        return res.status(404).send("product does not  found");
    }

    await ProductModel.findByIdAndDelete(id);
    res.status(200).send("Product deleted successfully");

    }
    catch(err){
        console.log(error);
    }
})
module.exports = productRouter;