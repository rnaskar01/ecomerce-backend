const express = require("express");
const server = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const LocalStrategy = require("passport-local").Strategy;
const CookieParser = require('cookie-parser');
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const { createProduct } = require("./controller/product");
const productsRouters = require("./routes/Products");
const categoriesRouters = require("./routes/Category");
const brandsRouters = require("./routes/Brands");
const userRouters = require("./routes/User");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const ordersRouters = require("./routes/Order");
const { User } = require("./model/User");
const crypto = require("crypto");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const cookieParser = require("cookie-parser");

const SECRET_KEY = 'SECRET_KEY';

// jwt options




const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; //ToDo: should not be in the code

//middlewares...

// server.use(express.static('build'))
server.use(cookieParser())

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productsRouters.router); // we can also use jwt token for client-only auth
server.use("/categories",isAuth(), categoriesRouters.router);
server.use("/brands",isAuth(), brandsRouters.router);
server.use("/users",isAuth(), userRouters.router);
server.use("/auth", authRouters.router);
server.use("/cart", isAuth(),cartRouters.router);
server.use("/orders",isAuth(), ordersRouters.router);

// passport Strategies

passport.use(
  "local",
  new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: "No such a user found" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, {
              message: "Invalid email id or password",
            });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, {id:user.id, role:user.role});
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({jwt_payload});
    try {
      const user = await User.findById(jwt_payload.id)
      if (user) {
        return done(null, sanitizeUser(user)); // this is called serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);

    }   
  })
);

// this create session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});


// payments


// This is your test secret API key.
const stripe = require("stripe")('sk_test_51P9ZoASFeo7VtoCi71ef1VLe4pfyD76rIZMaaYkcRMUfjO53Iz9ptSmk0MX0ETGsehh6DQqq6kK8v2qoeqYErjbw0069JBMKxE');

const calculateOrderAmount = (items) => {

  return 1400;
};

server.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log("items backend" + {items});

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected...");
}

server.listen(8080, () => {
  console.log("server started...");
});
