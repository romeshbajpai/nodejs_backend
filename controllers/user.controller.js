const UserModel = require("../models/user.model")

const register = async (req, res) => {
    console.log("test");
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
module.exports = {register}