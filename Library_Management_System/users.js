const express = require("express");
require("./database.js");
const jwt = require("jsonwebtoken");
const {
  loginauthorize,
  generateToken,
  verifyToken,
  updateData,
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
app.put("/users/update/:_id", updateData,verifyToken, (req, resp) => {
});

//delete
app.delete("/users/delete/:_id",daleteData,verifyToken, async (req, resp) => {
});


app.listen(5000);

