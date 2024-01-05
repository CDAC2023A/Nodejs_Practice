const express = require("express");
require("./database.js");
const jwt = require("jsonwebtoken");
const {
  loginauthorize,
  authorizationdata,
  verifyToken,
  updateData,
  verifyTokenput,
  daleteData,
  createData,
  Showdata
} = require("./interface.js");
const secreatKey = "secretkey";
const app = express();
require("dotenv").config();
app.use(express.json());
const expiresIn = process.env.JWT_EXPIRY_TIME || "500s";



//Read the data
app.get("/users/list", Showdata,async (req, resp) => {
  console.log("getting data....");
   
});


//Create data
app.post("/users/create", createData,async (req, resp) => {
});


//Login Users
app.post("/users/login", [loginauthorize], async (req, resp) => {
  jwt.sign({ authorizationdata }, secreatKey, { expiresIn }, (err, token) => {
    if (err) {
      console.error("Error generating token:", err);
      resp.status(500).json({ error: "Internal Server Error" });
    } else {
      resp.json({ token });
    }
    const user = usersData[0];
    console.log(user);
  });
});

//update
app.put("/users/update/:_id", updateData, (req, resp) => {
  jwt.verify(req.token, secreatKey, (err, authData) => {
    if (err) {
      console.error("Error generating token:", err);
      resp.status(500).json({ error: "Internal Server Error" });
    } else {
      resp.json({ token });
    }
  });
});

//delete
app.delete("/users/delete/:_id",daleteData,verifyTokenput, async (req, resp) => {
  jwt.verify(req.token, secreatKey, (err, authData) => {
    if (err) {
      console.error("Error generating token:", err);
      resp.status(500).json({ error: "Internal Server Error" });
    } else {
      resp.json({ token });
    }
  });

});


app.listen(5000);

