const express = require("express");
const connectDB = require("./connectDB");
const app=express();
const RegisterModel=require("./registerModel");
const joi=require("joi");
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const ProductModel=require("./productModel");
const authMiddleware=require("./authValidation");


 //========register=====
    app.post("/register", async (req, res) => {
  try {
    // Validation
    const validationSchema = joi.object({
      name: joi.string().min(2).max(64).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });

    const { error } = validationSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { name, email, password } = req.body;

    // Check if email already exists
    const userExist = await RegisterModel.findOne({ email });

    if (userExist) {
      return res.status(400).send("Email already registered!");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new RegisterModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send("User registered successfully!");
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});


    //=====login====
  app.post("/login", async (req, res) => {
  try {
    console.log(req.cookies);
    const validationSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    const { error } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = req.body;
    const userExist = await RegisterModel.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .send("oops! Invalid credentials!!");
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send("OOPS! Invalid credentials!!");
    }
    //generate a token and send it to the user
    const token=jwt.sign({userID:userExist.__id},"MySecretKey",{expiresIn:"1h"});

    res.cookie("givenToken",token,{httpOnly:true});

    res.status(200).send(`Welcome ${userExist.name}!! You are logged in successfully!`);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
});


//======log out=======
app.post("/logout",(req,res)=>{
  try{
    res.clearCookie("givenToken",{httpOnly:true});
    res.send("logout successful");
  }
  catch(err){
    console.log(err);
  }
})



//======== create product api========
app.post("/createProduct",async(req,res)=>{
  try{
    const validationSchema=joi.object({
      name:joi.string().min(2).max(64).required(),
      price:joi.number().min(1).required(),
      SKU:joi.string().max(64).required(),
      description:joi.string().max(256),
      category:joi.string().max(64).required(),
    });
    const {error}=validationSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const productExist = await ProductModel.findOne({
      
        SKU:req.body.SKU
    });
    if(productExist){
      return res.status(400).send("product already exist");
    }
    
const {name,price,SKU,description,category}=req.body;
console.log(req.body);
const newProduct={
  name:req.body.name,
  price:price,
  SKU:SKU,
  description:description,
  category:category
}
await ProductModel.create(newProduct);
res.send("product send successfully");
  }
  catch(err){
console.log(err);
  }
})


//=======product get======
app.get("/getAllProduct",authMiddleware,async(req,res)=>{
  try{
    const {page,limit,sort="ASC"}=req.query;
    let allProducts=await ProductModel.find({}).skip((page-1)*limit).limit(limit).select("- SKU ").sort(sort);
    res.json(allProduct);
  }
  catch(err){
    console.log(err);
  }
})


 //======get by id======
     app.get('/getProductsById/:id',async(req,res)=>{
      try{
 let singleProduct =  await ProductModel.findById(req.params.id);
 if(!singleProduct){
  res.status(404).send("product found")
 }
      res.json(singleProduct)

      }
      catch(err){
        console.log(err);
      }
   

    })


//=====update product=======
    app.patch("/updateSingleProduct/:id", async (req, res) => {
  try {
    // Get id from params
    const id = req.params.id;

    // Validation check
    if (!id) {
      return res.status(400).send("Product ID is required");
    }

    // Check if product exists
    const productExist = await ProductModel.findById(id);

    if (!productExist) {
      return res.status(404).send("Product not found");
    }

    // Get updated data
    const updatedData = req.body;

    // Update product in database
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Response
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


//=======delete product======

app.delete("/deleteProduct/:id", async (req, res) => {
  try {
    // Get id
    const id = req.params.id;

    // Validation check
    if (!id) {
      return res.status(400).send("Product ID is required");
    }

    // Check product exists
    const productExist = await ProductModel.findById(id);

    if (!productExist) {
      return res.status(404).send("Product not found");
    }

    // Delete product
    await ProductModel.findByIdAndDelete(id);

    // Response
    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
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