const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";
const expiresIn = process.env.JWT_EXPIRY_TIME || "500s";

let tokenData = [];
var tokenValue={};
const authorizationdata = [];
var DataFilter = {};

///writing schema here
const ProductSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  password: Number,
  dob: String,
  gender: String,
  role: {
    type: String,
    enum: ["admin", "student", "librarian"],
  },
});

module.exports = mongoose.model("users", ProductSchema);

const ProductsModel = mongoose.model("users", ProductSchema);

//Data list
async function Showdata(req, resp, next) {
  const usersList = await ProductsModel.find();
  resp.send(usersList);
  next();
}

//Login authorization middleware
async function loginauthorize(req, resp, next) {
  const { email, password } = req.query;
  const data = await ProductsModel.find();
  let filterdata = data.filter(
    (item) => item.email === email && item.password === parseInt(password)
  );
  if (filterdata.length > 0) {
    filterdata = filterdata.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      role: user.role,
      email: user.email,
      password: user.password   
    }));
    tokenData.push(...filterdata);
    DataFilter = filterdata[0];
    next();
  } else {
    resp.send("Unathaurized data");
  }
}

//generate token 
  async function generateToken(req,resp,next){
    jwt.sign({ tokenData }, secretKey, { expiresIn }, (err, token) => {
      if (err) {
        console.error("Error generating token:", err);
        resp.status(500).json({ error: "Internal Server Error" });
      } else {
        resp.json({ token });
      }
      tokenValue=tokenData[0];
        console.log(tokenValue);
      // const user = usersData[0];
      // console.log(user);
    });
    next();
  }





//Update data
async function updateData(req, resp, next) {
  const filter = { _id: req.params._id };
  let data = await ProductsModel.updateOne(filter, { $set: req.body });
  console.log(data);

  if (data.acknowledged) {
    resp.json({ message: "Data updated successfully ", data });
  } else {
    resp.json({ message: "No data updated Admin" });
  }
  next();
}



//Create data
async function createData(req, resp, next) {
  let data = await ProductsModel.create(req.body);

  if (data) {
    resp.json({ message: "Data updated successfully", data });
  } else {
    resp.json({ message: "No data updated" });
  }
  next();
}



//Delete data
async function daleteData(req, resp, next) {
  const filter = { _id: req.params._id };
  console.log(DataFilter);

  // admin login
  if (tokenValue.role === "admin" && tokenValue.id !== req.params._id) {
    let data = await ProductsModel.deleteOne(filter);
    if (data.deletedCount===1) {
      resp.json({ message: "Data deleted successfully Admin ", data });
    } else if(data.deletedCount===0) {
      resp.json({ message: "No Id present Admin" });
    }else{
      resp.json({ message: "No" });
    }
  
  }
  
  // librarian login
  else if (tokenValue.role === "librarian") {
    const usersList = await ProductsModel.find();
    const lidata = usersList.find(
      (user) => user._id.toString() === req.params._id
    );
    console.log(lidata);

    if (lidata.role === "student") {
      let data = await ProductsModel.deleteOne(filter);
      if (data.acknowledged) {
        resp.json({ message: "Data deleted successfully", data });
      } else {
        resp.json({ message: "No Id present" });
      }
    } else {
      resp.send("Librarian cannot delete admin");
    }
  }
  //Student login
  else if (tokenValue.role === "student") {
    const usersList = await ProductsModel.find();
    const studata = usersList.find(
      (user) => user._id.toString() === req.params._id
    );
    console.log(studata);
    if (
      studata.role === "admin" ||
      studata.role === "student" ||
      studata.role === "librarian"
    ) {
      resp
        .status(400)
        .json({ message: "Records will be deleted by admin only" });
    } else {
      console.log("Check details");
    }
  } else {
    resp.status(400).json({ message: "Records will be deleted by admin only" });
  }
  next();
}


//Token verify
function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    resp.send({
      result: "token is not valid",
    });
  }
}

//Verification token for put method
// function verifyTokenput(req, resp, next) {
//   const token = req.headers.authorization;
//   console.log(token);
//   if (!token) {
//     return resp.status(401).json({ error: "Unauthorized" });
//   }
//   jwt.verify(token, secretKey, (err, authData) => {
//     if (err) {
//       console.error("Error verifying token:", token);
//       return resp.status(403).json({ error: "Forbidden" });
//     }
//     req.userId = authData._id; // Assuming user ID is stored in the token
//     next();
//   });
// }

module.exports = {
  loginauthorize,
  tokenData,
  authorizationdata,
  verifyToken,
  updateData,
  daleteData,
  createData,
  Showdata,
  generateToken
};
