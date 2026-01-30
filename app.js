require("dotenv").config(); 
const express=require("express");
const app=express();
const db=require("./utils/db-connetion");
const cors = require("cors");
const userroute=require("./routes/userRoutes");
const path=require("path");
require("./models/user");


app.use(express.json());            
app.use(cors()); // allow all origins



app.use(express.static(path.join(__dirname, "./Frontend")));

//Routes
app.use("/user",userroute);

db.sync()
.then((res)=>{
        app.listen(process.env.PORT || 3000,()=>{
           console.log(`server running port ${process.env.PORT || 3000}`);
})
}).catch((err)=>{
        console.log(err);
});