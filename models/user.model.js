const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    first_name : {type:String,required:true},
    last_name :{type:String,required:true},
    age : {type:Number}
},{
    versionKey:false,
    timestamps :true
});
const UserModel = new mongoose.model("users",userSchema);
module.exports = UserModel;
