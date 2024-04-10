const express = require("express");
const server = express();
const cors = require ('cors');

const mongoose = require('mongoose');
const { createProduct } = require("./controller/product");
const productsRouters = require('./routes/Products')
const categoriesRouters= require ('./routes/Category')
const brandsRouters = require ('./routes/Brands')
const userRouters = require ('./routes/User')
const authRouters = require ('./routes/Auth')
const cartRouters = require('./routes/Cart')
const ordersRouters = require('./routes/Order')


//middlewares...
server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
server.use(express.json()); // to parse req.body
server.use('/products',productsRouters.router)
server.use('/categories',categoriesRouters.router)
server.use('/brands',brandsRouters.router)
server.use('/users',userRouters.router)
server.use('/auth',authRouters.router)
server.use('/cart',cartRouters.router)
server.use('/orders',ordersRouters.router)






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