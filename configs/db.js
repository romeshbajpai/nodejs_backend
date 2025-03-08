const mongoose = require("mongoose");
const connectDb = async ()=>{
    try {
       await mongoose.connect("mongodb://localhost:27017/Ecommerce")  
    // await mongoose.connect("mongodb://localhost:27017,localhost:27018,localhost:27019/Ecommerce?replicaSet=rs0")

    } 
    catch{
        return 'No connection established'
    }
      
}
module.exports = connectDb;