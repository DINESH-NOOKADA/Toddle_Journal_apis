const jwt = require("jsonwebtoken");
const checkValidToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) res.sendStatus(401); // unauthorized
  else {
    jwt.verify(token,'mynameisdinesh', (err, user) => {
      if (err) {
        res.status(403).send("Forbidden:Authorize before accessing");  // forbidden 
      }
      else {
        req.user = user;      // If valid jwt token sets a new field in request object as user and decrypted jwt token.
        next();
      }
    });
  }
};

const isTeacher=(req,res,next)=>{
    if(req.user.role=='teacher'){
        next();
    }
    else{
        res.status(403).send('Forbidden:not a teacher');
    }
}
module.exports={checkValidToken,isTeacher};