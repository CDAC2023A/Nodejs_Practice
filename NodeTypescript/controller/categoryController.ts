import Category from "../models/categoryBookModel";
import express from "express";
import verifyToken from "../token/jwtToken";

const createCategoryData = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      // Check if the category name already exists (case-insensitive)
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
      });
      if (existingCategory) {
        // Category already exists, send a response indicating that
        return resp.status(400).send("Category already exists");
      }

      const decodedToken = req.body.decoded;
      console.log(decodedToken);
      if (decodedToken.userData.role === "admin") {
        // If the category doesn't exist, create a new one
        const newCategory = await Category.create({
          name: req.body.name,
          totalBooks: req.body.books, // Assuming your model uses 'totalBooks'
        });
        resp.send(newCategory);
        
      } else {
        resp.send("Admin can create category");
      }
    });
  } catch (error) {
    // Handle other errors
    resp.status(500).send("Internal Server Error");
  }
};

export default {
  createCategoryData,
};
