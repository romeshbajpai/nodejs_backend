const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const authMiddleware = (req, res, next) => {
   
    const token = req.header("Authorization"); // Frontend se token aayega

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    try {
        const secretKey = process.env.SECRET_KEY; 
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; //attaching user data to the request    
        next();
       
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

const sellerAuthMiddleware = (req, res, next) => {
   
    const token = req.header("Authorization"); // Frontend se token aayega

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    try {
        const secretKey = process.env.SECRET_KEY; 
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; //attaching user data to the request    
        next();
       
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware, sellerAuthMiddleware;