const mongoose = require('mongoose');

const catgeorySchema = new mongoose.Schema({
    category_name: {type: String, required: true,trim: true,},
    category_description: {type: String, required: true,trim: true,},
    code: {type: Number, required: false,trim: true,},
    pcid: {type: Array, required: false,trim: true,},

    category_name_slug: { type: String, required: false,trim: true,},
    category_picture: { type: String, required: false,trim: true,},
    category_type: { type: Number, required: true,trim: true,},
    category_status: { type: Number, required: true,trim: true,},

},{
    versionKey:false,
    timestamps :true
})

const catgeoryModel = new mongoose.model("category", catgeorySchema);
module.exports = catgeoryModel;
