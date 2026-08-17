const express = require("express");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../../authValidation");
const authorization=require("../middleware/authorisation");
const {loadProductData,abacMiddleware}=require("../middleware/abacMiddleware");
const {
  createProductSchema
  
} = require("../validationSchema/productValidationSchema");
const {RegisterModel , ProductModel} = require("../model");
const { default: mongoose } = require("mongoose");
const productRouter = express.Router();
const productController = require("../controller/productController");

productRouter.post("/createProduct" ,authMiddleware,authorization("admin","seller"),abacMiddleware("product:create"), validationMiddleware(createProductSchema), productController.createProduct);

productRouter.get("/getProduct" , authMiddleware , abacMiddleware("product:read"),productController.getProduct);

productRouter.get("/getSingleProduct/:id" , authMiddleware ,abacMiddleware("product:read") ,productController.getProductById);

productRouter.patch("/updateSingleProduct/:id" , authMiddleware ,loadProductData, abacMiddleware("product:update"),productController.updateProduct);

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
        console.log(err);
    }
})
module.exports = productRouter;