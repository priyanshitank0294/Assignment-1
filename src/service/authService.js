const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const secretKey=process.env.secret_key;
const RegisterModel=require("../model/registerModel");
const authService= async (data)=>{
  const{name, email,password} = data ;
    const existUser = await RegisterModel.findOne({ email });
      if (existUser) {
        return res.status(400).send("this email is already registered");
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newuser = new RegisterModel({
        name,
        email,
        password: hashPassword,
      });

      await newuser.save();
}
const loginService=async(data)=>{
  const {email,password}=data;
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
    const token=jwt.sign({userID:userExist.__id},secretKey,{expiresIn:"1h"});
    return{
      token,user:userExist,
    };
}
module.exports={authService,loginService};