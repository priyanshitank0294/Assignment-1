const mongoose=require('mongoose');
const dns=require("dns");

dns.setServers(["8.8.8.8","8.8.4.4"])

const url=process.env.db_url;

const connectDB=async()=>{
    await mongoose.connect(url);
console.log("database connected");
}

module.exports=connectDB;