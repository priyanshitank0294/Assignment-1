const express = require("express");
const addressRouter = express.Router();
const authMiddleware = require("../../authValidation");
const validationMiddleware = require("../middleware/validationMiddleware");
const AddressModel = require("../model/addressModel");
const  addressValidationSchema  = require("../validationSchema/addressValidationSchema");
const authorisation=require("../../src/middleware/authorisation");
const escapeRegex=require("../utils/escapeRegex");

addressRouter.post(
  "/createAddress",
  authMiddleware,
  validationMiddleware(addressValidationSchema),
  async (req, res) => {
    try {
      const {
        type,
        street,
        city,
        state,
        country,
        pincode,
        longitude,
        latitude,
      } = req.body;
      let addressData = {
       userId: req.user._id,
        type,
        street,
        city,
        state,
        country,
        pincode,
        location: {
          type: "Point",
          coordinates: [ longitude, latitude ],
        },
      };
      await AddressModel.create(addressData);
      res.send("address successfuly created")
    } catch (err) {
      res.status(400).send({ message: err });
    }
  },
);


addressRouter.get("/addressNearMe",authMiddleware,async(req,res)=>{
    try{
        const{longitude,latitude,radius}=req.query;
        let addressData=await AddressModel.find({
            location:{
                $near:{
                    $geometry:{
                        type:"Point",
                        coordinates:[longitude,latitude]
                    },
                    $maxDistance:radius
                }
            }
        })
        res.status(200).send({message:addressData})
    }
    catch(err){
        
        console.log(err);
    }
})

addressRouter.get(
  "/searchAddress",
  authMiddleware,
  authorisation("user"),
  async (req, res) => {
    try {
      const { q } = req.query;

      const safeKeyword = escapeRegex(q);
      const searchAddress = new RegExp(safeKeyword, "i");

      const filter = {
        
        street: searchAddress
      };

      const addresses = await AddressModel.find(filter);

      res.status(200).send({
        message: "Addresses found",
        data: addresses
      });
    } catch (err) {
      console.log(err);

      res.status(500).send({
        message: "Error searching address"
      });
    }
  }
);

module.exports = addressRouter;