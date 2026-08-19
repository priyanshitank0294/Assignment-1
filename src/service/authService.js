const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const accessKey=process.env.access_key;
const refreshKey=process.env.refresh_key;
const RegisterModel=require("../model/registerModel");
const RefreshModel=require("../../src/model/refreshModel");
const {uploadBuffer , updateImage , deleteImage}= require("../utils/uploadBuffer");
const authService= async (req)=>{
  const{name, email,password,role} = req.body ;
    const existUser = await RegisterModel.findOne({ email });
      if (existUser) {
       return null;
      }
      const result = await uploadBuffer(
      req.file.buffer,
      "My-Image"
    );
      const hashPassword = await bcrypt.hash(password, 10);
      const newuser = new RegisterModel({
        name,
        email,
        password: hashPassword,
        role,
        userLogo:{
          url:result.secure_url,
          public_id:result.public_id
        }
      });

      await newuser.save();
      return newuser;
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
const updateImageService = async (req)=>{
  const  user = req.user
  if(!user){
    return null;
  }
  const newResult = await updateImage(
    req.file.buffer ,
    user.userLogo.public_Id,
    "My-Image",
  )
  user.userLogo= { 
   url: newResult.secure_url,
  public_Id:newResult.public_id,
  }
  await user.save();
  return {user, newResult};
}

const deleteImageService = async (req)=>{
 try{const user = req.user
 if(!user){
  return null;
 }
   if (!user.userLogo) {
      throw new Error("User does not have an image");
    }

 const oldPublic_id = user.userLogo.public_Id;

  if (!oldPublic_id) {
    throw new Error("User does not have an image");
  } 
 await deleteImage(oldPublic_id);
  user.userLogo = null;
 await user.save();

 return user;}
 catch(err){
  console.log(err);
 }
}

module.exports={authService,loginService,updateImageService,deleteImageService};