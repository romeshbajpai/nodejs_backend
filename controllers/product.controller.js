const ProductModel = require("../models/product.model");

const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.id;
        let objectId;
            const updateData = req.body;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        
        } catch (error) {
            return res.status(400).send({ success: false, message: 'Invalid product ID format' });
        }

        const product = await UserModel.findById({ _id: objectId});

        if(!user) {
            return res.status(404).send({ success: false, message: `Product not found.` }); 
        }

        const updatedProduct = await productModel.findByIdAndUpdate({ _id: objectId}, 
            { $set: updateData },
            { new: true, runValidators: true });

        if(!updatedProduct) {
            return res.status(400).send({ success: false, message: `User could not be updated.`, product }); 
        } 

        const productData = updatedProduct.toObject(); 

        return res.status(200).send({ success: true, message: `Category updated successfully!`, user: productData });

    } catch (error) {
       
        return res.status(500).send({ success: false, error: error.message });  
    }
}


const getAllProduct =  async (req, res) => {
    try {
        const productlist = await ProductModel.find({ status: true});

        if(!productlist) {
            return res.status(400).send({ success: false, message: `Product list not found` }); 
        }

        return res.status(200).send({ success: true, message: `Product list.`, productlist }); 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const getProduct = async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid User ID format' });
       }

        const product = await ProductModel.findOne({ _id: objectId});

        if(!product) {
            return res.status(400).send({ success: false, message: `Product not found` }); 
        }

         // Remove sensitive fields from the user object
         const productData = product.toObject(); // Convert Mongoose document to plain JavaScript object
 
 
         return res.status(200).send({ success: true, message: `User details`, user: productData });
 

    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id  = req.params.id;
        let objectId;
        try {
               objectId = new mongoose.Types.ObjectId(id);

       } catch (error) {
               return res.status(400).send({ success: false, message: 'Invalid product ID format' });
       }

        const product = await ProductModel.findOne({ _id: objectId});

        if(!product) {
            return res.status(400).send({ success: false, message: `Product not found` }); 
        }
        await ProductModel.findByIdAndDelete(objectId);
 
        return res.status(200).send({ success: true, message: `Product deleted successfully` });
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });  
    }
}

module.exports = {UpdateProduct, getAllProduct, getProduct, deleteProduct}