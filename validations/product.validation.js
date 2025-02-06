const { validationResult, check } = require("express-validator");

const createProductValidation = [
    check("title")
    .not()
    .isEmpty()
    .withMessage("Title should not be blank!")
    .exists()
    .isString()
    .withMessage("Title should be a string value")
    .trim(),

    check("description")
    .not()
    .isEmpty()
    .withMessage("Description should not be blank!")
    .exists()
    .isString()
    .withMessage("Description should a be string value!")
    .trim(),

    check("brand")
    .not()
    .isEmpty()
    .withMessage("Brand should not be blank!")
    .exists()
    .isString()
    .withMessage("Brand should be a string value!")
    .trim(),
    
    check("packageSizeDimention")
    .not()
    .isEmpty()
    .withMessage("packageSizeDimention should not be blank!")
    .exists()
    .isNumber()
    .withMessage("packageSizeDimention should be a number value!")
    .trim(),
    
 
    check("productSizeDimention")
    .not()
    .isEmpty()
    .withMessage("productSizeDimention should not be blank!")
    .exists()
    .isNumber()
    .withMessage("productSizeDimention should be a number value!")
    .trim(),

    
    check("colour")
    .not()
    .isEmpty()
    .withMessage("colour should not be blank!")
    .exists()
    .isNumber()
    .withMessage("colour should be a number value!")
    .trim(),

    
    check("price")
    .not()
    .isEmpty()
    .withMessage("price should not be blank!")
    .exists()
    .isNumber()
    .withMessage("price should be a number value!")
    .trim(),

    check("original_price")
    .isNumber()
    .withMessage("price should be a number value!")
    .trim(),

    check("tax")
    .not()
    .isEmpty()
    .withMessage("tax should not be blank!")
    .exists()
    .isNumber()
    .withMessage("tax should be a number value!")
    .trim(),

    check("tags")
    .not()
    .isEmpty()
    .withMessage("tags should not be blank!")
    .exists()
    .isArray()
    .withMessage("tags should be a array!")
    .trim(),

    check("category1")
    .not()
    .isEmpty()
    .withMessage("category1 should not be blank!")
    .exists()
    .isNumber()
    .withMessage("category1 should be a number value!")
    .trim(),

    check("category2")
    .not()
    .isEmpty()
    .withMessage("category2 should not be blank!")
    .exists()
    .isNumber()
    .withMessage("category2 should be a number value!")
    .trim(),

    check("sku")
    .not()
    .isEmpty()
    .withMessage("sku should not be blank!")
    .exists()
    .isString()
    .withMessage("sku should be a number value!")
    .trim(),

    check("status")
    .not()
    .isEmpty()
    .withMessage("status should not be blank!")
    .exists()
    .isNumber()
    .withMessage("status should be a number value!")
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

