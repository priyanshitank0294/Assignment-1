const joi=require("joi");
//===create====
const createProductSchema=joi.object({
      name:joi.string().min(2).max(64).required(),
      owner:joi.string().required(),
      price:joi.number().min(1).required(),
      SKU:joi.string().max(64).required(),
      description:joi.string().max(256),
      category:joi.string().max(64).required(),
    });

    module.exports={createProductSchema};