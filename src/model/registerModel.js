const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 64,
    minLength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role:{
    type:String,
    enum:["user","admin","seller"],
    required:true,
    trim:true,
    maxLength:10,
   default:"seller"
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 8,
    maxLength: 128,
    trim: true,
  },
},{timestamps:true});

AuthSchema.virtual("addresses",{
  ref:"Address",
  localField:"_id",
  foreignField: "userId",
})
AuthSchema.set("toJSON",{
  virtuals:true
});
AuthSchema.set("toObject",{
  virtuals:true
})


const RegisterModel = new mongoose.model("Auth", AuthSchema);

module.exports = RegisterModel;
