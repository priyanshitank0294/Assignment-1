const authService=require("../service/authService");
const registerUser= async (req, res) => {
    try {
      const { name, email, password } = req.body;
      await authService.authService({name,email,password});
      res.status(201).send(`${name}   You are registered successfully`);
    } catch (err) {
      console.log(err);
    }
  }

  const loginUser=async (req, res) => {
  try {
    // console.log(req.cookies);
    

    const { email, password } = req.body;
    const {token,user}=await authService.loginService({email,password});

    res.cookie("givenToken",token,{httpOnly:true});

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
  module.exports={registerUser,loginUser,logoutUser};