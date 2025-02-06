const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const sellerSchema = new mongoose.Schema({
    brand_name: { type: String, required: true,trim: true,},
    seller_name: { type: String,required: true,trim: true, unique: true,},
 
    email: {type: String, required: true,unique: true,trim: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Invalid email format.",
        },
    },
    phone_number: {
        type: String, required: true,
        validate: {
            validator: function (value) {
                return /^[6-9]\d{9}$/.test(value); // Validates Indian mobile numbers
            },
            message: "Invalid phone number. It should start with 6-9 and have 10 digits.",
        },
    },
    password: {
        type: String, required: true,minlength: 8, maxlength: 200,
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{8,20}$/.test(value);
            },
            message:
                "Password must be 8-20 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
    },
    confirm_password: {type: String, required: true, validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Confirm password must match the password.",
        },
    },

    status: { type: Boolean, required: true, default: true,},
    type:{ type: Number, require: true },
},{
    versionKey:false,
    timestamps :true
});


sellerSchema.pre("save", async function (next) {
    const hash = bcrypt.hashSync(this.password, 10);
    this.password = hash;
    delete this.confirm_password
    next();
});

const sellerModel = new mongoose.model("sellers",sellerSchema);
module.exports = sellerModel;
