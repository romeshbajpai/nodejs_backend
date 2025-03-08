const Joi = require("joi");

const passwordComplexity = (value, helpers) => {
    if(!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).{8,20}/.test(value)) {
        return helpers.message(
            "Password must be 8-20 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
    }
    return value;
}

const registerValidation = Joi.object({
    full_name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
        "string.empty" : 'Name is required',
        "string.min": 'Name cannot be less than 3 letters',
    }),

    user_name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
        "string.empty":"Username is required",
        "string.min": "Username can not be less than 3 letters",
    }),

    dob: Joi.date()
    .less("now")
    .required()
    .messages({
        "date.base": "Invalid format",
        "date.less": "Date of birth must be a valid past date.",
    }),

    email: Joi.string()
    .email()
    .required()
    .messages({
        "string.empty": "Email is required.",
        "string.email": "Please write in a valid email format",
    }),

    phone_number: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
        "string.empty": "Phone number is required.",
        "string.pattern": "Invalid phone number format",
    }),

    password: Joi.string()
    .custom(passwordComplexity)
    .required(),

    confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
        "any.only": "Confirm password does not match Password"
    }),

    gender: Joi.string()
    .required()
    .valid("male", "female", "others")
    .messages({
        "any.only": "Gender must be male, female or others"
    }),

    type: Joi.number()
    .required()
    .messages({
        "number.base": "Type must be a number.",
    })

})

const validateRegister = (req, res, next) => {
    const { error } = registerValidation.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Validation failed", errors: error.details });
    }
    next();
};


const loginValidation = Joi.object({
    email: Joi.string()
    .required()
    .email()
    .messages({
        "string.empty": 'Email is required.',
        "string.email": "Please use a valid email format",
    })
})

const validateLogin = (req, res, next) =>{
    const { error } = loginValidation.validate(req.body, {abortEarly: false});
    if (error) {
        return res.status(400).join({message: "Validation failed", errors: error.details})
    }
    next();
}

const updateUserValidation = Joi.object({
    full_name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
        "string.empty" : 'Name is required',
        "string.min": 'Name cannot be less than 3 letters',
    }),

    user_name: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
        "string.empty":"Username is required",
        "string.min": "Username can not be less than 3 letters",
    }),

    dob: Joi.date()
    .less("now")
    .required()
    .messages({
        "date.base": "Invalid format",
        "date.less": "Date of birth must be a valid past date.",
    }),

    email: Joi.string()
    .email()
    .required()
    .messages({
        "string.empty": "Email is required.",
        "string.email": "Please write in a valid email format",
    }),

    phone_number: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
        "string.empty": "Phone number is required.",
        "string.pattern": "Invalid phone number format",
    }),

    password: Joi.string()
    .custom(passwordComplexity)
    .required(),

    confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
        "any.only": "Confirm password does not match Password"
    }),

    gender: Joi.string()
    .required()
    .valid("male", "female", "others")
    .messages({
        "any.only": "Gender must be male, female or others"
    }),

    type: Joi.number()
    .required()
    .messages({
        "number.base": "Type must be a number.",
    })

})

const validateUpdate = (req, res, next) => {
    const { error } = updateUserValidation.validate(req.bosy, {abortEarly: false});
    if (error) {
        return res.status(400).join({message: "validation failed", errors: error.details})
    }
    next();
}


module.exports = {validateRegister, validateLogin, validateUpdate}