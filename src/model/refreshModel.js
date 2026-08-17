const mongoose=require("mongoose");
const refreshSchema=mongoose.Schema({
    refreshToken:{
        type:String,
        required:true,
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth",
        required:true,
    },
    expiredAt:{
        type:Date,
        required:true
    }


},{timestamps:true,strict:true})

const refreshModel=new mongoose.model("refreshToken",refreshSchema);
module.exports=refreshModel;