require("dotenv").config(); 
const express=require("express");
const app=express();
const db=require("./utils/db-connetion");
const cors = require("cors");
const userroutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const path=require("path");
require("./models");


app.use(express.json());            
app.use(cors()); // allow all origins



app.use(express.static(path.join(__dirname, "./Frontend")));

//Routes
app.use("/user",userroutes);
app.use("/chat", chatRoutes);

db.sync()
.then((res)=>{
        app.listen(process.env.PORT || 3000,()=>{
           console.log(`server running port ${process.env.PORT || 3000}`);
})
}).catch((err)=>{
        console.log(err);
});