const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const accessKey=process.env.access_key;
const refreshKey=process.env.refresh_key;
const RegisterModel=require("../model/registerModel");
const RefreshModel=require("../../src/model/refreshModel");
const authService= async (data)=>{
  const{name, email,password,role} = data ;
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
    // const token=jwt.sign({userID:userExist._id},secretKey,{expiresIn:"1h"});


    //access token
const accessToken=jwt.sign({
  id:userExist._id
},accessKey,{
  expiresIn:"1m"
});

//refresh token
const refreshToken=jwt.sign({
  id:userExist._id
},refreshKey,{
  expiresIn:"7d"
});
await RefreshModel.create({
  refreshToken:refreshToken,
  userID:userExist._id,
  expiredAt:new Date(Date.now()+ 7 * 24 * 60 * 1000)
})


    return{
      //token
      accessToken,refreshToken ,user:userExist,
    };
}
module.exports={authService,loginService};