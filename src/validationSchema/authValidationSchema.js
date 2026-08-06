const joi=require("joi");
//===register====
const RegisterSchema = joi.object({
      name: joi.string().min(2).max(64).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });


    //===login===
const LoginSchema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).max(20).required(),
    });
    module.exports={RegisterSchema,LoginSchema};