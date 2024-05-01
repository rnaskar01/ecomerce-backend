const { User } = require("../model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sanitizeUser, sendMail } = require("../services/common");
require ('dotenv').config()


exports.createUser = async (req, res) => {
  // this product we have to get from API body
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this is calls serializer and adds this session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:doc.id, role:doc.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
  .cookie("jwt", user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  })
  .status(201)
  .json({id:user.id, role:user.role});
};

exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user );
  }else{
    res.sendStatus(401)
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const resetPage = "http://localhost:3000/reset-password";
  const subject = "reset password for e-comerce Application"
  const html = `<p>Click <a href='${resetPage}'>here</a> to Reset Password</p>`
  if(req.user){
    sendMail({to:req.body.email,})
  }else{
    res.sendStatus(401)
  }
};
