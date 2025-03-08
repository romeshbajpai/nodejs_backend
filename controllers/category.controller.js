const categoryModel = require("../models/category.model");
const mongoose = require("mongoose"); 



const slugify = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/^-+|-+$/g, "");
};

const createCategory = async (req, res) => {
    try {
        const { category_name, category_description, code,  category_picture, pcid, category_type, category_status } = req.body;

        if (!category_name || !category_description || category_type === undefined || category_status === undefined) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }

        const category_name_slug = slugify(category_name);

        const existingCategory = await categoryModel.findOne({ category_name_slug });

        //The functions categoryModel.findOne() and newCategory.save() 
        // return Promises, which are being *awaited* inside the try block

        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists." });
        }

        const newCategory = new categoryModel({
            category_name,
            category_description,
            code,
            pcid,
            category_name_slug,
            category_picture,
            category_type,
            category_status,
        });

        await newCategory.save();

        return res.status(201).json({ success: true, message: "Category created successfully.", data: newCategory });

    } catch (error) {
        console.error("Error in createCategory:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// const UpdateCategory = async (req, res) => {
//     try {
//         const { id } = req.id;
//         let objectId;
//             const updateData = req.body;
//         try {
//             objectId = new mongoose.Types.ObjectId(id);
        
//         } catch (error) {
//             return res.status(400).send({ success: false, message: 'Invalid Category ID format' });
//         }

//         const Category = await categoryModel.findById({ _id: objectId});

//         if(!category) {
//             return res.status(404).send({ success: false, message: `Category not found.` }); 
//         }

//         const updatedCategory = await categoryModel.findByIdAndUpdate({ _id: objectId}, 
//             { $set: updateData },
//             { new: true, runValidators: true });

//         if(!updatedCategory) {
//             return res.status(400).send({ success: false, message: `category could not be updated.`, Category }); 
//         } 

//         const CategoryData = updatedCategory.toObject(); 

//         return res.status(200).send({ success: true, message: `Category updated successfully!`, category: CategoryData });

//     } catch (error) {
       
//         return res.status(500).send({ success: false, error: error.message });  
//     }
// }


const UpdateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Category ID format" });
        }

      
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

     
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate("pcid");

        if (!updatedCategory) {
            return res.status(400).json({ success: false, message: "Category could not be updated." });
        }

        return res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            category: updatedCategory,
        });

    } catch (error) {
        console.error("Error in UpdateCategory:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const getAllCategory =  async (req, res) => {
    try {
        const Categorylist = await categoryModel.find({ category_status: true});

        if(!Categorylist) {
            return res.status(400).send({ success: false, message: `Category list not found` }); 
        }

        return res.status(200).send({ success: true, message: `Category list.`, Categorylist }); 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const getCategory = async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid category ID format' });
       }

        const Category = await categoryModel.findOne({ _id: objectId}).populate("pcid");

        if(!Category) {
            return res.status(400).send({ success: false, message: `Category not found` }); 
        }

         // Remove sensitive fields from the category object
         const CategoryData = Category.toObject(); // Convert Mongoose document to plain JavaScript object
 
 
         return res.status(200).send({ success: true, message: `category details`, category: CategoryData });
 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const deleteCategory= async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid category ID format' });
       }

        const Category = await categoryModel.findOne({ _id: objectId});

        if(!Category) {
            return res.status(400).send({ success: false, message: `Category not found` }); 
        }
        await categoryModel.findByIdAndDelete(objectId);
 
        return res.status(200).send({ success: true, message: `Category deleted successfully` });
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

module.exports = {UpdateCategory, getAllCategory, getCategory, deleteCategory,createCategory}