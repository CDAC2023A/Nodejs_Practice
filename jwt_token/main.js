const express = require("express");
const jwt = require("jsonwebtoken");
const jwtfolder = require("./main.js");
const app = express();
const secreatKey = "secretkey";
const {authorize,authorizationdata}= require('./authorize.js')

app.get("/", (req, resp) => {
  resp.json({
    message: "a sample app",
  });
});

app.post("/login",[authorize], (req, resp) => {
  

  jwt.sign({ authorizationdata }, secreatKey, { expiresIn: "500s" }, (err, token) => {
    resp.json({ token });
  });
});

app.post("/profile", verifyToken,(req, resp) => {
   jwt.verify(req.token,secreatKey,(err,authData)=>{
      if(err){
        resp.send({result:"Invalid token"})
      }else{
        resp.json({
          message:"profile accessed",
          authData
        })
      }
   })
});

function verifyToken(req, resp, next) {
  const bearerHeader=req.headers['authorization'];
  if(typeof bearerHeader !== "undefined"){
   const bearer=bearerHeader.split(" ");
   const token=bearer[1];
   req.token=token;
   next();
  }else{
    resp.send({
      result:"token is not valid"
    })
  }
}

app.listen(5000, () => {
  console.log("app is running at 5000");
});
