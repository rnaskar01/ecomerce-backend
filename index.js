const express = require("express");
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require("./controller/product");
const productsRouters = require('./routes/Products')
const categoriesRouters= require ('./routes/Category')
const brandsRouters = require ('./routes/Brands')
const cors = require ('cors')

//middlewares...
server.use(cors())
server.use(express.json()); // to parse req.body
server.use('/products',productsRouters.router)
server.use('/categories',categoriesRouters.router)
server.use('/brands',brandsRouters.router)



main().catch(err=>console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connected...");
  } 

server.get("/",(req,res)=>{
    res.json({status :'success'})
})



server.listen(8080,()=>{
    console.log("server started...");
})