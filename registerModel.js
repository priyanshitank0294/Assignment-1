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
  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 8,
    maxLength: 128,
    trim: true,
  },
},{timestamps:true});

const RegisterModel = new mongoose.model("Auth", AuthSchema);

module.exports = RegisterModel;