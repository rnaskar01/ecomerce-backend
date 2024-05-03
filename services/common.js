const passport = require ('passport')
const nodemailer = require ('nodemailer');



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "rakeshnaskar499@gmail.com",
      pass: process.env.MAIL_PASS,
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
     // console.log("its work"+req.cookies['jwt']);

        token = req.cookies['jwt'];
    }
    // ToDo: this is temporary token for testing without cookies
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzU2YmU1MTBlOTI0ZjU0NDk5ZjFlMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE0Nzc3MDYxfQ.yfAFukD8CFo2JGYdK1yFBC2Gs_5dfqj6QzNtqkiGq8Q"
    return token;
  };



  exports.sendMail = async function ({to ,subject,html}){
   //console.log(to);  
    const info = await transporter.sendMail({
      from: '"E-comerce" <rakeshnaskar499@gmail.com>', // sender address
      to,
      subject,
      html
    });
    return info;
}
  