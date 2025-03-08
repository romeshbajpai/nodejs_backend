const orderModel = require("../models/order.model");
const ProductModel = require("../models/product.model");
const mongoose = require("mongoose");

// const createOrder = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const userId  = req.params.id;
//         const { products, address} = req.body;

//         if(!products || products.length === 0) {
//             return res.status(400).send({success: false, message: `A minimum of one product is required to create an order.`})
//         }

//         let totalAmount = 0;
//         let sellerId = null;
//         let orderProducts = [];

//         for (const item of products) {

//             if(!item.productId){
//                 await session.abortTransaction();
//                 session.endSession();
//                 return res.status(400).send({ success: false, message: "Missing productId in request body." });
//             }

//             const product = await ProductModel.findById(item?.productId).session(session);

//             if(!product) {
//                 await session.abortTransaction();
//                 session.endSession();
//                 return res.status(404).send({success: false, message: `Product with title ${item?.title} not found.`})
//             }
//             if(product.stock < item.quantity) {
//                 await session.abortTransaction();
//                 session.endSession();
//                 return res.status(404).send({success: false, message: `You ordered ${item.quantity} of "${product.title}", but only ${product.stock} are available.`})
//             }

//             sellerId = product.sellerId;
//             categoryId = product.category1;

//             orderProducts.push({
//                 productId : product._id,
//                 quantity: item.quantity,
//                 price: product.price,
//             })

        
//             totalAmount += product.price * item.quantity;

//             product.stock -= item.quantity;
//             await product.save({ session });

//         }

//         const newOrder = new orderModel({
//             userId,
//             sellerId,
//             products: orderProducts,
//             totalAmount,
//             address,
//             status:"Pending",
//             paymentStatus:"Unpaid"
//         });

//         await newOrder.save({session});
//         await session.commitTransaction();
//         session.endSession();

//         return res.status(201).send({success:true, message: 'Your order has been placed successfully!', data: newOrder})
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession()
//         console.error("Error in creating the order: ", error);
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }

const createOrder = async (req,res) => {
    try{
        
        const userId = req.user.id;
        console.log(req.user)
        const { products, address} = req.body;

        if(!products || products.length == 0){
            return res.status(400).send({
                success: false, 
                message: 'A minimum of one product is required to create an order'});
        }

        let totalAmount = 0;
        let orderProducts = [];

        for(const item of products){
            if(!item.productId || item.productId == 0){
                return res.send(400).send({
                    success: false, 
                    message:'Missing product in the request body'
                });
            }
         

            const product = await ProductModel.findById(item?.productId);
         

            if(!product){
                return res.send(404).send({
                    success: false, message:'No product found!'
                })
            }

            if(product.stock < item.quantity) {
                return res.status(404).send({
                    success: false,
                    message: `You ordered ${item.quantity} of "${product.title}", but only ${product.stock} are available.`,
                })
            }

            sellerId = product.sellerId
            categoryId = product.category1

            orderProducts.push({
                productId : product._id,
                quantity : item.quantity,
                price: product.price

            })

            totalAmount += product.price;
           
            product.stock -= item.quantity;
            
            const updateProduct = await ProductModel.findByIdAndUpdate({_id: product?._id},
                {$set: product}, {new:true}, {runValidators: true }
            )

            if(!updateProduct) {
                return res.status(400).send({ success: false, message: `Product could not be updated. Aborting transaction`, product }); 
            } 

            
        }

        const newOrder = new orderModel({
            userId,
            products: orderProducts,
            totalAmount,
            address,
            status: "Pending",
            paymentStatus: "Unpaid",
        });

        await newOrder.save();

        return res.status(201).send({success: true, messsage:'The order has successfully been placed.'})


    } catch(error){
        console.log(error);
        res.status(500).send({success:false, message:'Something happened. Try again afresh'})
    }
}

const orderStats = async(req, res) => {
    try {

        const HighestSoldProduct = await orderModel.aggregate([
            { $unwind: "$products"},
            { $group : {
                _id: "$products.productId",
                totalSold: { $sum: "$products.quantity"}
            }},
            {$sort: {totalSold:-1}},
            {$limit: 1},
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }},
            {$unwind: "$productDetails"},
            {$project: {
                productId: "$_id",
                totalSold: 1,
                name: "$productDetails.title"
            }}
        ]);

        const lowestSoldProduct = await orderModel.aggregate([
            {$unwind: "$products"},
            {$group: {
                _id : "$products.productId",
                totalSold: {$sum: "$products.quantity"},
            }},
            {$sort : {totalSold: 1}},
            {$limit: 1},
            {$lookup : {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }},
            {$unwind: "$productDetails"},
            {$project: {
                productId:"$_id",
                totalSold: 1,
                name: "$productDetails.title"
            }}
        ])
        

        const highestOrder = await orderModel.findOne().sort({ totalAmount: -1 }).limit(1);
        const lowestOrder = await orderModel.findOne().sort({ totalAmount: 1 }).limit(1);

        const totalRevenue = await orderModel.aggregate([
            {$group:{
                _id:null,
                totalEarnings: {$sum: "$totalAmount"}
            }}
        ])

        const userId = req.user.id;

        console.log(req.user)
        const userTotalSpent = await orderModel.aggregate([
            { $match: { userId: userId } },
            { 
                $group: { 
                    _id: "$userId", 
                    totalSpent: { $sum: "$totalAmount" } 
                } 
            }
        ]);

        const sellerTotalBusiness = await orderModel.aggregate([
            { $unwind: "$products" },
            { 
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            { 
                $group: { 
                    _id: "$productDetails.sellerId",
                    totalBusiness: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
                } 
            }
        ]);

        return res.status(200).send({
            success: true,
            highestSoldProduct: HighestSoldProduct.length ? HighestSoldProduct[0] : null,
            lowestSoldProduct: lowestSoldProduct.length ? lowestSoldProduct[0] : null,
            highestOrder,
            lowestOrder,
            totalRevenue,
            userTotalSpent,
            sellerTotalBusiness
        });

    } catch (error) {
        console.log('error: ', error);
        return res.status(500).send({success: false, message:'Some Issue happened. Try again!'})
    }
}

// const orderStats2 = async (req, res) => {
//     try {
        
//         const highestSoldProduct = await orderModel.aggregate([
//             { $unwind: "$products" },
//             { 
//                 $group: { 
//                     _id: "$products.productId",
//                     totalSold: { $sum: "$products.quantity" }
//                 }
//             },
//             { $sort: { totalSold: -1 } }, 
//             { $limit: 1 }, 
//             { 
//                 $lookup: {
//                     from: "products",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "productDetails"
//                 }
//             },
//             { $unwind: "$productDetails" },
//             { 
//                 $project: { 
//                     productId: "$_id",
//                     totalSold: 1,
//                     name: "$productDetails.title"
//                 }
//             }
//         ]);

//         return res.status(200).send({
//             success: true,
//             highestSoldProduct: highestSoldProduct.length ? highestSoldProduct[0] : null
//         });

//     } catch (error) {
//         console.log('Error: ', error);
//         return res.status(500).send({ success: false, message: 'Some issue happened. Try again!' });
//     }
// };


module.exports = {createOrder,orderStats}
