const passport = require ('passport')
const nodemailer = require ('nodemailer');



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "rakeshnaskar499@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

exports.isAuth = (req,res,done) => {
    return passport.authenticate('jwt')
};

exports.sanitizeUser = (user) =>{
    return {id:user.id, role:user.role}
}

exports.cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // ToDo: this is temporary token for testing without cookies
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Mjk3NGYwY2M1MWZlMjYxMDJjNTAyMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzEzOTkyOTQ0fQ.SuRe6TBsF7i78_yOl6BukvdFgn0bz5ihNzsmAGiV3KM"
    return token;
  };



  exports.sendMail = async function ({to ,subject,text,html}){
     
    const info = await transporter.sendMail({
      from: '"E-comerce" <rakeshnaskar499@gmail.com>', // sender address
      to,
      subject,
      text,
      html
    });
    return info;
}
  