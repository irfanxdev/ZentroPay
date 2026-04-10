import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from "dotenv"
dotenv.config();
import router from "./Routes/routes.js";
import cookieParser from "cookie-parser";


const app=express();

// middleware
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

// endpoint
app.use("/api/auth",router);
app.get("/",(req,res)=>{
     return res.status(200).json({msg:"This is Home Route"})
})

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongoose is connected"))
.catch((e)=>console.error("error to connect mongoose",e))

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server is running on the port ${port}`);
})