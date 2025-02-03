const categoryModel = require("../models/category.model");

const UpdateCategory = async (req, res) => {
    try {
        const { id } = req.id;
        let objectId;
            const updateData = req.body;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        
        } catch (error) {
            return res.status(400).send({ success: false, message: 'Invalid Category ID format' });
        }

        const Category = await categoryModel.findById({ _id: objectId});

        if(!category) {
            return res.status(404).send({ success: false, message: `Category not found.` }); 
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate({ _id: objectId}, 
            { $set: updateData },
            { new: true, runValidators: true });

        if(!updatedCategory) {
            return res.status(400).send({ success: false, message: `category could not be updated.`, Category }); 
        } 

        const CategoryData = updatedCategory.toObject(); 

        return res.status(200).send({ success: true, message: `Category updated successfully!`, category: CategoryData });

    } catch (error) {
       
        return res.status(500).send({ success: false, error: error.message });  
    }
}


const getAllCategory =  async (req, res) => {
    try {
        const Categorylist = await categoryModel.find({ status: true});

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

        const Category = await categoryModel.findOne({ _id: objectId});

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

module.exports = {UpdateCategory, getAllCategory, getCategory, deleteCategory}