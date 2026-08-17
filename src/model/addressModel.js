const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        type:{
            type:String,
            enum:["Home","Office","Billing","Shipping","industrial"],
            default:"Home"
        },

        street: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        state: {
            type: String,
            required: true
        },

        pincode: {
            type: String,
            required: true
        },

        country: {
            type: String,
            default: "India"
        },
        location:{
            type:{
                type:String,
                enum:["Point"],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
        }
    },
    {
        timestamps: true
    }
);

addressSchema.index({ location: "2dsphere" });
const AddressModel = mongoose.model("Address", addressSchema);

module.exports = AddressModel;