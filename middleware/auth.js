const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const authMiddleware = (req, res, next) => {
   
    const token = req.header("Authorization"); // Frontend se token aayega

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    try {
        const id  = req.params.id;
        if(!id) {
            return res.status(401).send({ success: false, message: 'No Id found!' });
        }

        const secretKey = process.env.SECRET_KEY; 
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
    
        if(id == decoded?.userId ){
         req.user = decoded; 
        } else {
         return res.status(401).send({ success: false, message: 'Authentication error!! Invalid token.' });
        }
                   
        next();
       
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;