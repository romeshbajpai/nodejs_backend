const express  = require("express");
const app = express();
const port = 8080;
app.use(express.json())// it will attach body in request object
app.listen(port,()=>{
    console.log(`Your application is running at ${port}`);
});