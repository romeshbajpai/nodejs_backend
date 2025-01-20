const mongoose = require("mongoose");
const connectDb = async ()=>{
    return mongoose.connect("mongodb://localhost:27017/Ecommerce")
}
module.exports = connectDb;