const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization"); // Frontend se token aayega

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No Token Provided." });
    }

    try {
        const secretKey = process.env.SECRET_KEY; // Isko .env file me store karo
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; // User ki details request me attach kar do
        next(); // Next middleware ko call karo (API execute hogi)
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;