const mongoose = require('mongoose');

const addressSchema = mongoose.schema({
    default: {type: Number, required: false,trim: true,},
    type: { type: Number, required: false, trim: true},
    addressLine1: { type: String, required: true,trim: true,},
    addressLine2: { type: String, required: false,trim: true,},
    city: { type: Number, required: true,trim: true,},
    state: { type: Number, required: true,trim: true,},
    country: { type: Number, required: true,trim: true,},
    pincode: { type: String, required: true,trim: true,},

},{
    versionKey:false,
    timestamps :true
})


const AddressModel = new mongoose.model("address", addressSchema);
module.exports = AddressModel;