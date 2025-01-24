const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true,trim: true,},
    description: { type: String, required: true,trim: true,},
    brand: { type: String, required: true,trim: true,},
    packageSizeDimention: { type: Number, required: true,trim: true,},
    productSizeDimention: { type: Number, required: true,trim: true,},
    colour: {type: Number, required: true,trim: true,},
    price: { type: Number, required: true,trim: true,},
    original_price: {type: Number, required: true,trim: true,},
    tax: {type: Number, required: true,trim: true,},
    tags: {type: String, required: true,trim: true,},
    isfeature: {type: String, required: false,trim: true,},
    category1: { type: Number, required: true,trim: true,},
    category2: { type: Number, required: true,trim: true,},
    category3: { type: Number, required: false,trim: true,},
    category4: { type: Number, required: false,trim: true,},
    sku: { type: Number, required: false,trim: true,},
    title_slug: { type: String, required: false,trim: true,},
    status: { type: Number, required: true, default: true,}, /** 0 inactive, 1 active, 1 sold out */
    sellerId: {type: Number, required: true, default: true,}
},{
    versionKey:false,
    timestamps :true
})

const ProductModel = new mongoose.model("products",productSchema);
module.exports = ProductModel;