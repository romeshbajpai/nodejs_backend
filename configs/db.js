const mongoose = require("mongoose");
const connectDb = async ()=>{
    try {
       await mongoose.connect("mongodb://localhost:27017/Ecommerce")  
    } 
    catch{
        return 'No connection established'
    }
      
}
module.exports = connectDb;