const mongoose = require('mongoose');

const catgeorySchema = new mongoose.Schema({
    category_name: {type: String, required: true,unique: true, trim: true,},
    category_description: {type: String, required: true,trim: true,},
    code: {type: String, required: false,unique: true,trim: true,},
    // pcid: {type: Array, required: false,trim: true,},
    pcid: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
    category_name_slug: { type: String, unique: true,required: false,trim: true,},
    category_picture: { type: String, required: false,trim: true,},
    category_type: { type: Number, required: true,trim: true,},
    category_status: { type: Number, required: true,trim: true,},

},{
    versionKey:false,
    timestamps :true
})

const catgeoryModel = new mongoose.model("category", catgeorySchema);
module.exports = catgeoryModel;
