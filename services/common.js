const passport = require ('passport')

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