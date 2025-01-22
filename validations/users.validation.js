const { validationResult, check } = require("express-validator");

const registerValidation = [
    check("full_name")
    .not()
    .isEmpty()
    .withMessage("Name should not be blank!")
    .exists()
    .isString()
    .withMessage("Name should be string value")
    .isLength({min:3, max:30})
    .withMessage("Name should be between 3 to 30 characters long!")
    .trim(),
    check("user_name")
    .not()
    .isEmpty()
    .withMessage("Name should not be blank!")
    .exists()
    .isString()
    .withMessage("Name should be string value")
    .isLength({min:3, max:30})
    .withMessage("Name should be between 3 to 30 characters long!")
    .matches(/[\W_]/)
    .withMessage("Name should contain at least one special character!")
    .trim(),
    check("dob")
    .not()
    .isEmpty()
    .withMessage("Date of birth is required!")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Date of birth must be a valid date in YYYY-MM-DD format!")
    // .custom((value) => {
    //     const today = new Date();
    //     const dob = new Date(value);
    //     const age = today.getFullYear() - dob.getFullYear();
    //     const m = today.getMonth() - dob.getMonth();
    //     if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    //         age--;
    //     }
    //     if (age < 18) {
    //         console.log("1");
            
    //         throw new Error("You must be at least 18 years old!");
    //     }
    //     if (age > 100) {
    //         console.log("2");
    //         throw new Error("Age cannot exceed 100 years!");
    //     }
    //     return true;
    // })
    // .withMessage("Date of birth must be valid and within the acceptable age range!")
    .trim(),
    check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters!")
    // .custom((value) => {
    //     const domain = value.split("@")[1];
    //     const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    //     if (!allowedDomains.includes(domain)) {
    //         throw new Error("Email domain is not allowed! Please use gmail.com, yahoo.com, or outlook.com.");
    //     }
    //     return true;
    // })
    // .withMessage("Email domain must be valid!")
    .trim(),
    // .normalizeEmail(),
    check("phone_number")
    .not()
    .isEmpty()
    .withMessage("Phone number is required!")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number starting with 6-9!")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits long!")
    .trim(),
    check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 to 20 characters long!")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one numeric digit!")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter!")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter!")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character!")
    .trim(),
    check("confirm_password")
    .not()
    .isEmpty()
    .withMessage("Confirm Password is required!")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Confirm Password does not match Password!");
        }
        return true;
    }),
    check("gender")
    .not()
    .isEmpty()
    .withMessage("Gender is required!")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender selected!"),
    check("type")
    .not()
    .isEmpty()
    .withMessage("Type is required!")
    .isNumeric()
    .withMessage("Type must be a number"),
    function (req,res,next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                message: "Something went wrong",
                status: "fail",
                error: errors.array()
            });
        }
        next();
    }


]


const loginValidation = [
    check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Please provide a valid email address!")
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters!"),

    check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .trim(),
    
    function (req,res,next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                message: "Something went wrong",
                status: "fail",
                error: errors.array()
            });
        }
        next();
    }

]
module.exports = {registerValidation, loginValidation}