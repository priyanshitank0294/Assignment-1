const { request } = require("express");
const jwt= require("jsonwebtoken");
let secretKey=process.env.secret_key;
const authMiddleware=(req,res,next)=>{
    const token=req.cookies.givenToken;
    if(!token){
        return res.status(401).send("access denied unauthorised user");
    }
    
    const decoded=jwt.verify(token,secretKey)
    if(!decoded){
        return res.status(404)
    }
    console.log("decoded",decoded);
    req.user=decoded;
    next();
}
module.exports=authMiddleware;