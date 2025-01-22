const mongoose = require("mongoose");
const connectDb = async ()=>{
    try {
       await mongoose.connect("mongodb://localhost:27017/Ecommerce")
        console.log(`mongodb connected `)
    } 
    catch{
        return 'No connection established'
    }
      
}
module.exports = connectDb;