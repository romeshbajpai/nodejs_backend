const express  = require("express");
const connectDb = require("./configs/db");
const userRouter = require("./routes/user.route")
const productRouter = require("./routes/product.route")
const categoryRouter = require("./routes/category.route")
const sellerRouter = require("./routes/seller.route")
const orderRouter = require("./routes/order.route")
const fs = require("fs");

const rateLimit = require("express-rate-limit");

const app = express();
const port = 8080;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Send rate limit headers to the client
  });

app.use(limiter);

app.use(express.json())// it will attach body in request object

// Middleware to log API requests

app.use((req, res, next) => {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  
    fs.appendFile("logs.txt", logMessage, (err) => {
      if (err) console.error("Failed to log request:", err);
    });
  
    next();
  });

  
app.use("/api/v1/ecommerce", userRouter)
app.use("/api/v1/ecommerce/product", productRouter)
app.use("/api/v1/ecommerce/category", categoryRouter)
app.use("/api/v1/ecommerce/seller", sellerRouter)
app.use("/api/v1/ecommerce/order", orderRouter)



  // 🛑 Global Error Handling Middleware
app.use((err, req, res, next) => {

    const errorLog = `${new Date().toISOString()} - ERROR: ${err.message}`;

    fs.appendFile("error_logs.txt", errorLog, (fileErr) => {
        if(fileErr) console.log('Failed to log error: ', fileErr);
    })

    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong !!"})
})





app.listen(port,async ()=>{
    try {
        await connectDb();
        console.log(`Your application is running at ${port}`);
        
    } catch (error) {
        console.log(error.message);
    }
    
});

