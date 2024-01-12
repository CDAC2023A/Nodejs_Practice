const Users = require("../models/usersModel");
const tokenManager = require("../tokenMiddleware/tokenManager");
const bcrypt = require("bcrypt");
const { extractUserData } = require("../tokenMiddleware/jwtToken");
const Category = require("../models/categoryModel");
const IssuedBook = require("../models/issueBookModel");
var DataFilter = {};
var userData;

module.exports = {
  //Create a new data
  createData: async (req, resp, next) => {
    const { email, phone, password, role, gender, dob, name } = req.body;

    try {
      // Check if the email or phone already exists
      const existingUser = await Users.findOne({ $or: [{ email }, { phone }] });

      if (existingUser) {
        return resp
          .status(400)
          .json({ message: "Email or phone number already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user if not already exists with the encrypted password
      const data = await Users.create({
        email,
        phone,
        password,
        role,
        gender,
        dob,
        name,
      });

      resp.json({ message: "Data created successfully", data });
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.code === 11000) {
        // Duplicate key error (MongoDB error code for duplicate key)
        return resp
          .status(400)
          .json({ message: "Email or phone number already exists." });
      }

      resp.status(500).json({ message: "Internal server error" });
    }

    next();
  },

  //Get the list of data from db
  Showdata: async (req, resp, next) => {
    const usersList = await Users.find();
    resp.send(usersList);
    next();
  },

  //Login authorization middleware
  loginauthorize: async (req, resp, next) => {
    const { email, password } = req.body;
    try {
      // Retrieve the user with the given email
      const user = await Users.findOne({ email });

      if (user) {
        // Compare hashed password from the request with the stored hashed password
        // const passwordMatch = await bcrypt.compare(password, user.password);
        const passwordMatch = password === user.password;

        if (passwordMatch) {
          // Authentication successful
          req.userData = {
            id: user._id.toString(),
            name: user.name,
            role: user.role,
            email: user.email,
          };
          next();
        } else {
          resp.status(401).send("Unauthorized: Incorrect password");
        }
      } else {
        resp.status(401).send("Unauthorized: User not found");
      }
    } catch (error) {
      console.error("Error during login:", error);
      resp.status(500).json({ message: "Internal server error" });
    }
  },

  //Update data
  updateData: async (req, resp, next) => {
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

  //Delete Data
  deleteData: async (req, resp, next) => {
    const filter = { _id: req.params._id };
    console.log(DataFilter);
    try {
      // Extract user data from the token
      const data = extractUserData(req);

      // admin login
      if (data.role === "admin" && data.id !== req.params._id) {
        let data = await Users.deleteOne(filter);
        if (data.deletedCount === 1) {
          resp.json({ message: "Data deleted successfully Admin ", data });
        } else if (data.deletedCount === 0) {
          resp.json({ message: "No Id present Admin" });
        } else {
          resp.json({ message: "No" });
        }
      }

      // librarian login
      else if (data.role === "librarian") {
        const usersList = await Users.find();
        const lidata = usersList.find(
          (user) => user._id.toString() === req.params._id
        );

        if (lidata.role === "student") {
          let data = await Users.deleteOne(filter);
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
      else if (data.role === "student") {
        const usersList = await Users.find();
        const studata = usersList.find(
          (user) => user._id.toString() === req.params._id
        );
        // console.log(studata);
        if (
          studata.role === "admin" ||
          studata.role === "student" ||
          studata.role === "librarian"
        ) {
          resp
            .status(401)
            .json({ message: "Records will be deleted by admin only" });
        } else {
          console.log("Check details");
        }
      } else {
        resp
          .status(402)
          .json({ message: "Records will be deleted by admin only" });
      }
      next();
    } catch (error) {
      // Handle authentication errors
      console.error("Authentication error:", error);
      resp.status(401).json({ error: "Unauthorized" });
    }
  },

  //Issue book
  issueBook: async (req, resp, next) => {
    const { _idcategory, _idbook, _idstudent } = req.body;
    try {
      // Extract user data
      const userData = extractUserData(req);
      console.log(userData);

      // Check if the user is a librarian
      if (userData.role === "librarian") {
        // Check if the category exists
        const category = await Category.findOne({ _id: _idcategory });
        if (!category) {
          return resp.status(404).json({ message: "CategoryId not found" });
        }

        // Find the book within the category
        const bookid = await category.books.find((b) => b.id === _idbook);
        console.log(bookid);
        if (bookid) {
          // Create an IssuedBook entry
          let payload = {
            bookId: _idbook,
           // bookName:bookid.name,
            categoryId: _idcategory,
            // categoryName:category.name,
            studentid: _idstudent,
            librarian: userData.id,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          };
          // Due date is set to 5 days from now
          const issuedBook = new IssuedBook(payload);
          await Promise.all([issuedBook.save()]);
          resp.json({ message: "Book issued successfully", issuedBook });

          // Find the book within the category
          const bookIndex = category.books.findIndex((b) => b.id === _idbook);
          console.log(bookIndex);
          if (bookIndex !== -1) {
            // Remove the book from the category
            category.books.splice(bookIndex, 1);

            // Save the updated category
            await category.save();
          }
        } else {
          return resp
            .status(404)
            .json({ message: "Book not found in the specified category" });
        }
      } else {
        resp.status(403).json({ message: "Only librarians can issue books" });
      }
    } catch (error) {
      console.error("Error issuing book:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
    next();
  },
};
