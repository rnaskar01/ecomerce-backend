const express = require("express");
const server = express();
const cors = require ('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const { createProduct } = require("./controller/product");
const productsRouters = require('./routes/Products')
const categoriesRouters= require ('./routes/Category')
const brandsRouters = require ('./routes/Brands')
const userRouters = require ('./routes/User')
const authRouters = require ('./routes/Auth')
const cartRouters = require('./routes/Cart')
const ordersRouters = require('./routes/Order');
const { User } = require("./model/User");
const crypto = require("crypto");



//middlewares...

server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));
  server.use(passport.authenticate('session'));


server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
server.use(express.json()); // to parse req.body
server.use('/products',isAuth,productsRouters.router) // we can also use jwt token
server.use('/categories',categoriesRouters.router)
server.use('/brands',brandsRouters.router)
server.use('/users',userRouters.router)
server.use('/auth',authRouters.router)
server.use('/cart',cartRouters.router)
server.use('/orders',ordersRouters.router)

// passport Strategies

passport.use(new LocalStrategy(
    async function(username, password, done) {
        // by default passport uses username
        try {
            const user = await User.findOne({email:username}).exec();
            if(!user){
                return done(null,false,{message: "No such a user found"})
            }
            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                "sha256",
                async function (err, hashedPassword) {
               if(!crypto.timingSafeEqual(user.password, hashedPassword)){
                return done(null,false,{message: 'Invalid email id or password'});
                }
                done(null,user);

            })
        } catch (err) {
            done(err);
    
        }
    }
  ));

  // this create session variable req.user on being called from callbacks
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {id:user.id,role:user.role});
    });
  });
  
  // this changes session variable req.user when called from authorized request
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });




main().catch(err=>console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connected...");
  } 

server.get("/",(req,res)=>{
    res.json({status :'success'})
})

function isAuth(req,res,done){
    if(req.user){
        done()
    }else{
        res.send(401)
    }
}

server.listen(8080,()=>{
    console.log("server started...");
})