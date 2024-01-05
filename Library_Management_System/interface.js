const mongoose = require("mongoose");

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
const authorizationdata = [];
var DataFilter = {};
module.exports = mongoose.model("users", ProductSchema);
const ProductsModel = mongoose.model("users", ProductSchema);

//Data list
async function Showdata(req, resp, next) {
  const usersList = await ProductsModel.find();
  resp.send(usersList);
  next();
}

///Login authorization middleware
async function loginauthorize(req, resp, next) {
  const { email, password } = req.query;
  const data = await ProductsModel.find();
  let filterdata = data.filter(
    (item) => item.email === email && item.password === parseInt(password)
  );
  if (filterdata.length > 0) {
    const filteredDataWithoutPassword = filterdata.map(
      ({ password, ...rest }) => rest
    );
    authorizationdata.push(...filteredDataWithoutPassword);
    filterdata = filterdata.map((user) => ({
      name: user.name,
      role: user.role,
      email: user.email,
      password: user.password,
      id: user._id.toString(),
    }));
    DataFilter = filterdata[0];
    next();
  } else {
    resp.send("Unathaurized data");
  }
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
  if (DataFilter.role === "admin" && DataFilter.id !== req.params._id) {
    let data = await ProductsModel.deleteOne(filter);
    if (data.acknowledged) {
      resp.json({ message: "Data deleted successfully Admin ", data });
    } else {
      resp.json({ message: "No Id present Admin" });
    }
   
  } 
   // librarian login
  else if (DataFilter.role === "librarian") {
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
  else if(DataFilter.role === "student")
  {
    const usersList = await ProductsModel.find();
    const studata = usersList.find(
      (user) => user._id.toString() === req.params._id
    );
    console.log(studata);
    if(studata.role==='admin' || studata.role==='student' || studata.role==='librarian'){
      resp.status(400).json({ message: "Records will be deleted by admin only" });
    }
    else{
      console.log("Check details");
    }
  }
  else {
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

///Verification token for put method
function verifyTokenput(req, resp, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secreatKey, (err, authData) => {
      if (err) {
        console.error("Error verifying token:", err);
        resp.status(403).json({ error: "Forbidden" });
      } else {
        req.userId = authData._id; // Assuming user ID is stored in the token
        next();
      }
    });
  } else {
    resp.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = {
  loginauthorize,
  authorizationdata,
  verifyToken,
  updateData,
  verifyTokenput,
  daleteData,
  createData,
  Showdata,
};
