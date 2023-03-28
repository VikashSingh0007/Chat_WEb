const express=require("express")
const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config();

mongoose
.connect(process.env.CONNECTION_URL,{
   
})
.then(console.log("database is connected"))
.catch((err)=>{
    console.log("db is not connected");
})
