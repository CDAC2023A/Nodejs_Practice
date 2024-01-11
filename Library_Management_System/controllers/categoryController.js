const Category = require("../models/categoryModel");
const { extractUserData } = require("../tokenMiddleware/jwtToken");

module.exports = {

  //create the categoryand list of book
  create: async (req, resp) => {
    try {
      const userData = extractUserData(req);

      // Check if the category name already exists (case-insensitive)
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
      });

      if (existingCategory) {
        // Category already exists, send a response indicating that
        return resp.status(400).send("Category already exists");
      }
      if (userData.role === "admin") {
        // If the category doesn't exist, create a new one
        const newCategory = await Category.create({
          name: req.body.name,
          books: req.body.books,
        });
        resp.send(newCategory);
      } else {
        resp.send((message = "Admin can create category"));
      }
    } catch (error) {
      console.error(error);

      if (error.name === "MongoError" && error.code === 11000) {
        // Duplicate key error, check if it's for the 'name' field
        if (error.keyPattern && error.keyPattern.name) {
          return resp
            .status(400)
            .send("Category name must be unique (case-insensitive)");
        }
      }

      // Handle other errors
      resp.status(500).send("Internal Server Error");
    }
  },

  categorylist: async (req, resp) => {
    try {
      const categories = await Category.find();

      // Map over the categories to add the book count to each category
      const categorieslist = categories.map((category) => {
        return {
          _id: category._id,
          name: category.name,
          books: category.books,
          booksCount: category.booksCount,
        };
      });
      return resp.send(categorieslist);
    } catch (error) {
      console.error(error);
      return resp.status(500).send("Internal Server Error");
    }
  },
  //data update
  updateData: async (req, resp, next) => {
    try {
      const filter = { _id: req.params._id }; //categoryId

      const userData = extractUserData(req);

      let data;

      if (userData.role === "admin") {
        data = await Category.updateOne(filter, { $set: req.body });
        console.log(data);

        if (data.acknowledged) {
          resp.json({ message: "Data updated successfully", data });
        } else {
          resp.json({ message: "No data updated" });
        }
      } else {
        console.log("Only admin has access to update data");
        resp.status(403).json({ message: "Unauthorized" });
      }

      next();
    } catch (error) {
      console.error("Error during data update:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  },

  //delete 
  deleteData: async (req, resp, next) => {
    const filter = { _id: req.params._id };
    try {
      const userData = extractUserData(req);

      // admin login
      if (userData.role === "admin") {
        const result = await Category.deleteOne(filter);

        if (result.deletedCount === 1) {
          resp.json({
            message: "Data deleted successfully Admin ",
            data: result,
          });
        } else if (result.deletedCount === 0) {
          resp.json({ message: "No Id present Admin" });
        } else {
          resp.json({ message: "No" });
        }
      } else {
        resp.status(403).json({ message: "Admin access only" });
      }
    } catch (error) {
      // Handle authentication errors
      console.error("Authentication error:", error);
      resp.status(401).json({ error: "Unauthorized" });
    }
    next();
  },

  
};
