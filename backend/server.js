const mongoose =require('mongoose')
const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const path=require('path')
const app=express()

const adminRoutes=require('./routes/adminRoutes')
const productRoutes = require("./routes/productRoutes");

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads")); // Access images via /uploads/filename.jpg


app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT=5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
})