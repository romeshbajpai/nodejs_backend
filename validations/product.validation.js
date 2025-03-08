
const Joi = require("joi");

const createProductValidation = Joi.object({
    title: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'Name is required',
    }),

    description: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'description is required',
    }),

    brand: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'description is required',
    }),

    packageSizeDimention: Joi.number()
    .required()
    .messages({
        "string.empty" : 'packageSizeDimention is required',
    }),

  

    productSizeDimention: Joi.number()
    .required()
    .messages({
        "string.empty" : 'packageSizeDimention is required',
    }),

    colour: Joi.number()
    .required()
    .messages({
        "string.empty" : 'colour is required',
    }),


    price: Joi.number()
    .required()
    .messages({
        "string.empty" : 'price is required',
    }),

    original_price: Joi.number(),


    tax: Joi.number()
    .required()
    .messages({
        "string.empty" : 'tax is required',
    }),


    tags: Joi.array()
    .required()
    .messages({
        "string.empty" : 'tags are required',
    }),


    category1: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'category1 is required',
    }),

    category2: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'category2 is required',
    }),

    category3: Joi.string()
    .trim(),

    category4: Joi.string()
    .trim(),


    sku: Joi.string()
    .trim()
    .required()
    .messages({
        "string.empty" : 'sku is required',
    }),

    isfeature: Joi.boolean(),

    status: Joi.number(),


})

const ValidateCreate = (req,res,next) => {
    const { error } = createProductValidation.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ message: "Validation failed", errors: error.details });
    }
    next();
}

   
module.exports = {ValidateCreate}




