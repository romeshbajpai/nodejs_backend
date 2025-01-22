const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();


const register = async (req, res) => {
    try {
        const { email } = req.body;
        const checkWithEmail = await UserModel.findOne({ email: email });
        if (checkWithEmail) {
            return res.status(409).send({ success: false, message: `User with ${email} already exists` });
        }
        const user = await UserModel.create({ viewPassword: req.body.password, ...req.body });
        if (!user) {
            return res.status(400).send({ success: false, message: `Unable to create user` }); 
        }
        return res.status(201).send({ success: true, message: `User created successfully`,user }); 
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });   
    }
}

const login = async (req, res) => {
    try {
        const { email, password} = req.body
        if(!email || email == "" || !password || password == ""){
            return res.status(402).send({ success: false, message: "Please enter email and password." });   
        } 

        const user = await UserModel.findOne({ email: email });
        if(!user){
            return res.status(200).send({ success: false, message: `No user id found with ${user}` });   
        }

        const match =  bcrypt.compare(password, user.password)
        if(!match) {
            return res.status(401).send({ success: false, message: "Invalid password." });    
        }

        const token = jwt.sign({user}, process.env.SECRET_KEY)
        return res.status(201).send({ success: true, message: 'Login successfull.', token, user });

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });   
    }
}
module.exports = {register, login}