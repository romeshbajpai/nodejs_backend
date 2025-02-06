const sellerModel= require("../models/seller.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const mongoose = require('mongoose');

const register = async (req, res) => {
    try {
        const { email, brandname } = req.body;
        const checkWithEmail = await sellerModel.findOne({ email: email, brandname: brandname });
        if (checkWithEmail) {
            return res.status(409).send({ success: false, message: `User with ${email} or ${brandname} already exists` });
        }

        const seller = await sellerModel.create({ viewPassword: req.body.password, ...req.body });
        if (!seller) {
            return res.status(400).send({ success: false, message: `Unable to create seller` }); 
        }

        return res.status(201).send({ success: true, message: `Seller created successfully`,seller }); 
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

        const seller = await sellerModel.findOne({ email: email });
        if(!seller){
            return res.status(200).send({ success: false, message: `No seller id found with ${seller}` });   
        }

        const match =  bcrypt.compare(password, seller.password)
        if(!match) {
            return res.status(401).send({ success: false, message: "Invalid password." });    
        }

        if(req.url == "/login-seller" ){
            if (seller.type != 1) {
                return res.status(401).send({ success: false, message: `No seller id found with ${seller.email}` });   
            }
        }


        
        const accessToken = jwt.sign(
            { id: seller._id, email: seller.email, role: seller.type },
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

const updateSeller = async (req, res) => {

    try {
        const id  = req.params.id;
        let objectId;
        const updateData = req.body;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid Seller ID format' });
       }

        const seller = await sellerModel.findById({ _id: objectId});
        if(!seller) {
            return res.status(404).send({ success: false, message: `Seller not found.` }); 
        }


        const updatedSeller = await sellerModel.findByIdAndUpdate({ _id: objectId}, 
            { $set: updateData }, //$set updates the database entry
            { new: true, runValidators: true });

        if(!updatedSeller) {
            return res.status(400).send({ success: false, message: `Seller could not be updated.`, seller }); 
        }   
            
           // Remove sensitive fields from the user object
           const sellerData = updatedSeller.toObject(); // Convert Mongoose document to plain JavaScript object
           delete sellerData.password;
           delete sellerData.confirm_password;
   
           return res.status(200).send({ success: true, message: `Seller updated successfully!`, user: sellerData });
           


    } catch (error){
        return res.status(500).send({ success: false, error: error.message });  
    }

}

const getAllSeller =  async (req, res) => {
    try {
        const sellerList = await sellerModel.find({ status: true});

        if(!sellerList) {
            return res.status(400).send({ success: false, message: `Seller list not found` }); 
        }

        return res.status(200).send({ success: true, message: `Seller list`, sellerList }); 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const getSeller = async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid seller ID format' });
       }

        const seller = await sellerModel.findOne({ _id: objectId});

        if(!seller) {
            return res.status(400).send({ success: false, message: `seller not found` }); 
        }

         // Remove sensitive fields from the user object
         const sellerData = seller.toObject(); // Convert Mongoose document to plain JavaScript object
         delete sellerData.password;
         delete sellerData.confirm_password;
 
         return res.status(200).send({ success: true, message: `User details`, seller: sellerData });
 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const logout = async (req, res) => {
    try {
        const { id } = req.body;
        const seller = await sellerModel.findById(id);

        if (!seller) {
            return res.status(404).send({ success: false, message: 'Seller not found.' });
        }

        seller.refreshToken = null; // Invalidate the refresh token
        await seller.save();

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
        const user = await UserModel.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send({ success: false, message: 'Invalid refresh token.' });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.type },
            process.env.SECRET_KEY,
            { expiresIn: '15m' } // Short-lived token
        );

        return res.status(200).send({ success: true, accessToken });

    } catch (error) {
        return res.status(403).send({ success: false, message: 'Invalid refresh token.' });
    }
};


module.exports = {register, login, updateSeller, getAllSeller, getSeller, logout, refreshAccessToken}