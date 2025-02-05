const UserModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const mongoose = require('mongoose');

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

        if(req.url == "/login-user" ){
            if (user.type != 1) {
                return res.status(401).send({ success: false, message: `No user id found with ${user.email}` });   
            }
        }

        
        if(req.url == "/login-seller" ){
            if (user.type != 2) {
                return res.status(401).send({ success: false, message: `No seller id found with ${user.email}` });   
            }
        }

        if(req.url == "/login-admin" ){
            if (user.type != 0) {
                return res.status(401).send({ success: false, message: `No admin id found with ${user.email}` });   
            }
        }


        
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.type },
            process.env.SECRET_KEY,
        );

        // const refreshToken = jwt.sign(
        //     { userId: user._id },
        //     process.env.REFRESH_SECRET_KEY,
        //     { expiresIn: '4d' } // Long-lived token
        // );

        // user.refreshToken = refreshToken;

        // await user.save();

        return res.status(200).send({ 
            success: true, 
            message: 'Login successful.', 
            accessToken, 
            // refreshToken 
        });



        // const token = jwt.sign({user}, process.env.SECRET_KEY)
        // return res.status(201).send({ success: true, message: 'Login successfull.', token, user });

    } catch (error) {
        return res.status(500).send({ success: false, error: `Hi ${error.message}` });   
    }
}

const updateUser = async (req, res) => {

    try {
        const id  = req.params.id;
        let objectId;
        const updateData = req.body;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid User ID format' });
       }

        const user = await UserModel.findById({ _id: objectId});
        if(!user) {
            return res.status(404).send({ success: false, message: `User not found.` }); 
        }


        const updatedUser = await UserModel.findByIdAndUpdate({ _id: objectId}, 
            { $set: updateData }, //$set updates the database entry
            { new: true, runValidators: true });

        if(!updatedUser) {
            return res.status(400).send({ success: false, message: `User could not be updated.`, user }); 
        }   
            
           // Remove sensitive fields from the user object
           const userData = updatedUser.toObject(); // Convert Mongoose document to plain JavaScript object
           delete userData.password;
           delete userData.confirm_password;
   
           return res.status(200).send({ success: true, message: `User updated successfully!`, user: userData });
           


    } catch (error){
        return res.status(500).send({ success: false, error: error.message });  
    }

}

const getAllUser =  async (req, res) => {
    try {
        const userlist = await UserModel.find({ status: true});

        if(!userlist) {
            return res.status(400).send({ success: false, message: `User list not found` }); 
        }

        return res.status(200).send({ success: true, message: `User list`, userlist }); 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const getUser = async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid User ID format' });
       }

        const user = await UserModel.findOne({ _id: objectId});

        if(!user) {
            return res.status(400).send({ success: false, message: `User not found` }); 
        }

         // Remove sensitive fields from the user object
         const userData = user.toObject(); // Convert Mongoose document to plain JavaScript object
         delete userData.password;
         delete userData.confirm_password;
 
         return res.status(200).send({ success: true, message: `User details`, user: userData });
 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const logout = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found.' });
        }

        user.refreshToken = null; // Invalidate the refresh token
        await user.save();

        return res.status(200).send({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(403).send({ success: false, message: 'Refresh token is required.' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

        // Find user in the database
        const user = await UserModel.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send({ success: false, message: 'Invalid refresh token.' });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.type },
            process.env.SECRET_KEY,
            { expiresIn: '15m' } // Short-lived token
        );

        return res.status(200).send({ success: true, accessToken });

    } catch (error) {
        return res.status(403).send({ success: false, message: 'Invalid refresh token.' });
    }
};


module.exports = {register, login, updateUser, getAllUser, getUser, logout, refreshAccessToken}