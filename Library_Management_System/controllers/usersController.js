const Users = require("../models/usersModel");
let tokenData = [];

const {tokenValue}= require('../tokenMiddleware/jwtToken');

module.exports = {
   

  createData: async (req, resp, next) => {
    let data = await Users.create(req.body);

    if (data) {
      resp.json({ message: "Data updated successfully", data });
    } else {
      resp.json({ message: "No data updated" });
    }
    next();
  },

  Showdata: async (req, resp, next) => {
    const usersList = await Users.find();
    resp.send(usersList);
    next();
  },

  //Login authorization middleware
  loginauthorize: async (req, resp, next) => {
    const { email, password } = req.query;
    const data = await Users.find();
    let filterdata = data.filter(
      (item) => item.email === email && item.password === parseInt(password)
    );
    if (filterdata.length > 0) {
      filterdata = filterdata.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
        password: user.password,
      }));
      tokenData.push(...filterdata);
      DataFilter = filterdata[0];
      next();
    } else {
      resp.send("Unathaurized data");
    }
    module.exports.tokenData = tokenData;
  },

  //Update data
   updateData: async (req, resp, next)=> {
    const filter = { _id: req.params._id };
    let data = await Users.updateOne(filter, { $set: req.body });
    console.log(data);
  
    if (data.acknowledged) {
      resp.json({ message: "Data updated successfully ", data });
    } else {
      resp.json({ message: "No data updated Admin" });
    }
    next();
  },

  deleteData: async (req, resp, next) =>{
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
};
