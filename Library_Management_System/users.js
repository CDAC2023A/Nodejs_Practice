const express = require("express");
require("./database.js");
const jwt = require("jsonwebtoken");
const {
  loginauthorize,
  generateToken,
  verifyToken,
  updateData,
  tokenData,
  verifyTokenput,
  daleteData,
  createData,
  Showdata
} = require("./authmiddleware.js");
const secretKey = "secretkey";
const app = express();
require("dotenv").config();
app.use(express.json());




//Read the data
app.get("/users/list", Showdata,async (req, resp) => {
  console.log("getting data....");
   
});


//Create data
app.post("/users/create", createData,async (req, resp) => {
});


//Login Users
app.post("/users/login", [loginauthorize,generateToken], async (req, resp) => {
});


//update
app.put("/users/update/:_id", updateData,verifyTokenput, (req, resp) => {
  // jwt.verify(req.token, secretKey, (err, authData) => {
  //   if (err) {
  //     console.error("Error generating token:", err);
  //     resp.status(500).json({ error: "Internal Server Error" });
  //   } else {
  //     resp.json({ token });
  //   }
  // });
});

//delete
app.delete("/users/delete/:_id",daleteData, async (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      console.error("Error generating token:", err);
      resp.status(500).json({ error: "Internal Server Error" });
    } else {
      resp.json({ token });
    }
  });

});


app.listen(5000);

