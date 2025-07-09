const mongoose =require('mongoose')
const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const path=require('path')
const app=express()

app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
    console.log('mongodb connected succesful')
}).catch((err)=>{
    console.log(err)
})

const PORT=5000
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
})