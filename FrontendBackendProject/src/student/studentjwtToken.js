const jwt = require("jsonwebtoken");
//const secretKey = "secretkey";
var key='123456789trytryrtyr';
let tokenData = [];
const expiresIn = process.env.JWT_EXPIRY_TIME || "500s";




//generate token 
async function generateToken(req,resp,next){
  
  if (err) {
    console.error("Error generating token:", err);
    resp.status(500).json({ error: "Internal Server Error" });
  }else{
    const token = jwt.sign({
      email: result.email,
      firstname: result.firstname,
      lastname: result.lastname,
      // Add more fields as needed
      
  }, key, { expiresIn: '1h' });
  resp.json({ token });
  }
  next();
    
  }
  module.exports = {
    generateToken
  };