import Category from "../models/categoryBookModel";
import express from "express";
import verifyToken from "../token/jwtToken";
import Categories from "../models/CategoriesBookModel";
//import IBook from "../models/CategoriesBookModel";

//Create Category
const createCategoryData = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      // Check if the category name already exists (case-insensitive)
      const existingCategory = await Categories.findOne({
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
        const newCategoryData = await Categories.create({
          name: req.body.name,
          books: req.body.books.map((book: any) => ({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            Totalquantity: book.Totalquantity,
            issuedQty: 0, // Initial issued quantity is 0
            RemainQty: book.Totalquantity, // Set initial remaining quantity equal to total quantity
            perDayCharges: book.perDayCharges,
          })),
        });

        // Send a success response
        resp.json({
          success: true,
          message: "Category created successfully",
          newCategoryData,
        });

        next();
      } else {
        resp.send("Admin can create category");
      }
    });
  } catch (error) {
    // Handle other errors
    resp.status(500).send("Internal Server Error");
  }
};

//Show Category list
const ShowCategorylist = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const CategoryList = await Category.find();
    resp.status(200).json(CategoryList);
    next();
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

//Add book in particular category
const addBookToCategory = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      const decodedToken = req.body.decoded;

      // Check if the user is an admin
      if (decodedToken.userData.role !== "admin") {
        resp.status(403).send("Only admin can add books to the category");
        return;
      }

      const { book, categoryId } = req.body;

      // Find the category by ID
      const existingCategory: any = await Categories.findOne({
        _id: categoryId,
      });
      console.log(existingCategory);

      if (!existingCategory) {
        resp.status(404).send("Category not found");
        return;
      }

      // Check if the book with the same title already exists in the category
      const bookExists = existingCategory.books.some(
        (b: any) => b.title === book.title
      );

      if (bookExists) {
        resp
          .status(400)
          .send("Book with the same title already exists in the category");
        return;
      }

      const updatedCategory: any = await Categories.findOneAndUpdate(
        { _id: categoryId, "books.title": { $ne: book.title } },
        {
          $push: {
            books: {
              title: book.title,
              author: book.author,
              publisher: book.publisher,
              Totalquantity: book.Totalquantity,
              issuedQty: 0,
              RemainQty: book.Totalquantity,
              perDayCharges: book.perDayCharges,
            },
          },
        },
        { new: true }
      );
      

      // Send a success response
      resp.json({
        success: true,
        message: "Book added to category successfully",
        updatedCategory: updatedCategory,
      });

      next();
    });
  } catch (error) {
    // Handle other errors
    console.error(error);
    resp.status(500).send("Internal Server Error");
  }
};

//delete Category
const deleteCategory = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const filter = { _id: req.params._id };
    await verifyToken.verifyToken(req, resp, async () => {
      // Continue with your logic after verifying the token
      const decodedToken = req.body.decoded;
      console.log(decodedToken);
      if (decodedToken.userData.role === "admin") {
        const data = await Categories.exists(filter);
        if (data) {
          const deletedCategory = await Categories.deleteOne(filter);
          if (deletedCategory.deletedCount > 0) {
            // Deletion successful
            resp.status(200).json({ message: "Category deleted successfully" });
          } else {
            // Deletion failed
            resp.status(500).json({ error: "Failed to delete category" });
          }
        } else {
          // _id does not exist in the Category collection
          resp.status(404).json({ error: "Category not found" });
        }
      }
    });
    next();
  } catch (error) {
    // Handle other errors
    resp.status(500).send("Internal Server Error");
  }
};

//exports
export default {
  createCategoryData,
  addBookToCategory,
  ShowCategorylist,
  deleteCategory,
};
