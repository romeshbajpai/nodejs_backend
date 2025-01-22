const express  = require("express");
const connectDb = require("./configs/db");
const userRouter = require("./routes/user.route")
const app = express();
const port = 8080;
app.use(express.json())// it will attach body in request object
app.use("/api/v1/ecommerce",userRouter)
app.listen(port,async ()=>{
    try {
        await connectDb();
        console.log(`Your application is running at ${port}`);
        
    } catch (error) {
        console.log(error.message);
    }
    
});