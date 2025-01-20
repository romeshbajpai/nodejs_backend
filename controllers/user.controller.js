const UserModel = require("../models/user.model")

const addUser = async (req , res)=>{
    try {
        const user = await UserModel.create(req.body);
        return res.status(201).json({status:"success",message:"user added successfully!",user})
    } catch (error) {
        return res.status(500).json({status:"fail",error : error.message});
    }
}
module.exports = {addUser}