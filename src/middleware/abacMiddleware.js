const policies = require("../config/policies");
const ProductModel=require("../model/productModel");

const loadProductData=async(req,res,next)=>{
const productData= await ProductModel.findById(req.params.id);

if(!productData){
    return res.send("product not found")
};
req.product=productData;
next();
}


const abacMiddleware=(action)=>(req,res,next)=>{
    const roles=policies[action];
    if(!roles){
       return res.send("action not found")
    };

    
    
    const isAllowed = roles.some((rule) =>
  rule({
    user: req.user,
    product: req.product
  })
);
    if(!isAllowed){
        return res.send("you are not authorised to access this data")
    }
    next();
}

module.exports={loadProductData,abacMiddleware};
