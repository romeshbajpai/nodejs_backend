const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
    // sellerId:{ type: mongoose.Schema.Types.ObjectId, ref: "sellers", required: true},
    products:[
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "products", required: true},
            quantity: { type: Number, required: true, default: 1},
            price: { type: Number, required: true}
        }
    ],
    // categoryId: { type: mongoose.Schema.Types.objectId, ref:"category", required: true},
    totalAmount: { type: Number, required: true,},
    status: { type: String, enum:["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],required: true},
    paymentStatus: {type:String, enum:["Paid", "Unpaid", "Refunded"], default:"Unpaid",required: true},
    addressUser: { type: mongoose.Schema.Types.ObjectId, ref: "address", required: false},
    addressSeller: { type: mongoose.Schema.Types.ObjectId, ref: "address", required: false},
},{
    versionKey:false,
    timestamps :true
})

const orderModel = new mongoose.model("order", orderSchema);
module.exports = orderModel;