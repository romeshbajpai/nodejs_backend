const ProductModel = require("../models/product.model");

const UpdateProduct = async (req, res) => {
    try {
        const id  = req.params.id;
        const updateData = req.body;

        const product = await ProductModel.findById({ _id: id});
  

        if(!product) {
            return res.status(404).send({ success: false, message: `Product not found.` }); 
        }


        const updatedProduct = await ProductModel.findByIdAndUpdate({ _id: id}, 
            { $set: updateData },
            { new: true, runValidators: true });



        if(!updatedProduct) {
            return res.status(400).send({ success: false, message: `Product could not be updated.`, product }); 
        } 

        const productData = updatedProduct.toObject(); 

        return res.status(200).send({ success: true, message: `Product updated successfully!`, product: productData });

    } catch (error) {
       
        return res.status(500).send({ success: false, error: `Product update error: ${error.message }`});  
    }
}

const slugify = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }



const createProduct = async ( req, res) => {
    try {
        const sellerId  = req.user.id;
    
        if(!sellerId) {
            return res.status(401).send({ success: false, message: 'unauthorised access!' });
        }

        if (!req.body || typeof req.body !== "object") {
            return res.status(400).send({ success: false, message: "Invalid input data" });
        }


        const { title, ...productData } = req.body;

        let slug = slugify(title);

   
        let duplicateProduct = await ProductModel.findOne({ slug });
       
        while (duplicateProduct) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`; // Add a random number
            duplicateProduct = await ProductModel.findOne({ slug });
        }

        const product = await ProductModel.create(
           { ...productData,
            title,
            slug,
            sellerId,}
        );

        await product.save();
 

        if (!product) {
            return res.status(400).send({ success: false, message: `Unable to create product.` }); 
        }

        return res.status(201).send({ success: true, message: `Product created successfully`, product }); 

    } catch (error) {
        return res.status(500).send({ success: false, error: `Product creation error: ${error.message }`}); 
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

        const product = await ProductModel.findOne({ _id: id})
        .populate("sellerId")
        .populate("category1", "category_name category_type")
        .populate("category2", "category_name category_type")
        if(!product) {
            return res.status(400).send({ success: false, message: `Product not found` }); 
        }

         // Remove sensitive fields from the product object
         const productData = product.toObject(); // Convert Mongoose document to plain JavaScript object
 
 
         return res.status(200).send({ success: true, message: `Product details`, product: productData });
 

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

module.exports = {UpdateProduct, getAllProduct, getProduct, deleteProduct,createProduct}