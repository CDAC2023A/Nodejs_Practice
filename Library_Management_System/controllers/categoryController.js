const Category = require("../models/categoryModel");
const { tokenValue } = require("../tokenMiddleware/jwtToken");
module.exports = {
  create: async (req, resp) => {
    try {
      // Check if the category name already exists (case-insensitive)
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
      });

      if (existingCategory) {
        // Category already exists, send a response indicating that
        return resp.status(400).send("Category already exists");
      }

      // If the category doesn't exist, create a new one
      const newCategory = await Category.create({
        name: req.body.name,
        books: req.body.books,
      });
      resp.send(newCategory);
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
};
