const mongoose =require('mongoose')
const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const path=require('path')
const app=express()

const adminRoutes=require('./routes/adminRoutes')
const productRoutes = require("./routes/productRoutes");
const userRoutes=require("./routes/userRoutes")
const cartRoutes=require("./routes/cartRoutes")
const orderRoutes=require("./routes/orderRoutes")
const supplierRoutes=require("./routes/supplierRoutes")

app.use(cors())
app.use(express.json())
app.use("/api/uploads", express.static("uploads")); // Access images via /uploads/filename.jpg
app.use('/api/profile', express.static('profile'));


app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user",userRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/supplier",supplierRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const PORT=5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
})