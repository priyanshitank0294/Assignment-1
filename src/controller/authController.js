const authService=require("../service/authService");
const registerUser= async (req, res) => {
    try {

     
     const user= await authService.authService(req);
     if(!user){
      return res.status(400).send("Email already exist");
     }
      res.status(201).send(`  You are registered successfully`);
    } catch (err) {
      console.log(err);
    }
  }

  const loginUser=async (req, res) => {
  try {
    // console.log(req.cookies);
    

    const { email, password } = req.body;
    const {accessToken,refreshToken,user}=await authService.loginService({email,password});

    res.cookie("givenToken",accessToken,{httpOnly:true});
    res.cookie("refreshtoken",refreshToken,{httpOnly:true})

    res.status(200).send(`Welcome ${user.name}!! You are logged in successfully!`);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVER ERROR!");
  }
}


const logoutUser=async  (req,res)=>{
    // handlle logout logic here
    try {
    res.clearCookie("givenToken", { httpOnly: true });
    res.status(200).send(" user logout successfully");
  } catch (err) {
    console.log(err);
  }
}

const updateImage = async (req,res)=>{
 try {
    if(!req.file){
      res.status(404).send("image don't exist!");
    };

    const {user,newResult} = await  authService.updateImageService(req);
    if(!user){
    return  res.send("user not found");
    }
    return res.status(200).send({
      message :" image updated successfully" ,
      image:{
        url: newResult.secure_url,
        public_Id: newResult.public_id,
      }
    });

    }
    catch(err){
      console.log(err);
      return res.status(500).send({
        message: "Image upload failed",
        error: err.message
      });
    }
    
  }

  const deleteImage = async (req,res)=>{
    try{


const user = await authService.deleteImageService(req);
if(!user){
 return  res.send("user not found");

}
 return res.status(200).send({
      message :" image deleted successfully" ,
      
    });

    }
    catch(err){
      console.log(err);
      return res.status(500).send({
        message:"Image not deleted",
        error:err.message
      });
    }
  }
  module.exports={registerUser,loginUser,logoutUser,updateImage,deleteImage};