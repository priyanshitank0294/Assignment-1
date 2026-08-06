

const mongoose=require('mongoose');
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:4,
        maxLength:64
    },
    SKU:{
type:String,
unique:true,
require:true,
trim:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    description:{
        type:String,
        trim:true,
        minLength:0,
        maxLength:264

    },
    category:{
        type:String,
        enum:["Electronics","Clothing","Books","Home","Sports"],
        required:true,
        trim:true,
        minLength:4,
        maxLength:64,
    }

});
const ProductModel=mongoose.model("product",productSchema);
module.exports =ProductModel;  