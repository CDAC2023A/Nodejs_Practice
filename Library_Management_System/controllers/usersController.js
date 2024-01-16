const Users = require("../models/usersModel");
const tokenManager = require("../tokenMiddleware/tokenManager");
const bcrypt = require("bcrypt");
const { extractUserData } = require("../tokenMiddleware/jwtToken");
const Category = require("../models/categoryModel");
const IssuedBook = require("../models/issueBookModel");
const StudentBook= require("../models/StudentBookdata")
var DataFilter = {};
const { parse, differenceInDays } = require("date-fns");

module.exports = {
  //Create a new data
  registerUserData: async (req, resp, next) => {
    const { email, phone, password, role, gender, dob, name } = req.body //as import("../interfaces/newUserInterface").newUser;

    try {
      // Check if the email or phone already exists
      const existingUser = await Users.findOne({ $or: [{ email }, { phone }] });

      if (existingUser) {
        return resp
          .status(400)
          .json({ message: "Email or phone number already exists." });
      }

      // Hash the password
      //const hashedPassword = await bcrypt.hash(password, 10);

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
  ShowUsersdata: async (req, resp, next) => {
    const usersList = await Users.find();
    resp.send(usersList);
    next();
  },

  //Login authorization middleware
  loginUser: async (req, resp, next) => {
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
  updateUserData: async (req, resp, next) => {
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
  deleteUserData: async (req, resp, next) => {
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
    const { _idbook, _idstudent, qty, fromDate, uptoDate } = req.body;
    try {
      // Extract user data
      const userData = extractUserData(req);
      console.log(userData);
      // Check if the user is a librarian
      if (userData.role === "librarian") {
        // Check if the student exists

        const student = await Users.findOne({ _id: _idstudent });

        if (!student) {
          return resp.status(404).json({ message: "StudentId not found" });
        }

        // Find the category
        const category = await Category.find();

        if (!category) {
          return resp.status(404).json({ message: "Category not found" });
        }
        // Find the book
        const categories = await Category.findOne({ "books._id": _idbook });

        if (!categories || !categories.books || categories.books.length === 0) {
          return resp
            .status(404)
            .json({ message: "BookId not found in the specified category" });
        }

        const bookIndex = categories.books.findIndex(
          (b) => b._id.toString() === _idbook
        );

        if (bookIndex === -1) {
          return resp
            .status(404)
            .json({ message: "BookId not found in the specified category" });
        }
        let book;

        // Iterate over all categories
        for (const currentCategory of category) {
          // Find the book within the current category's books array
          book = currentCategory.books.find(
            (b) => b._id.toString() === _idbook
          );

          // If the book is found in the current category, log and break out of the loop
          if (book) {
            break;
          }
        }

        if (!book) {
          return resp
            .status(404)
            .json({ message: "BookId not found in the specified category" });
        }
        const perDayCharge = 5;

        // Calculate the number of days
        // Parse the date strings into JavaScript Date objects
        const fromDateObj = parse(fromDate, "dd/MM/yyyy", new Date());
        const uptoDateObj = parse(uptoDate, "dd/MM/yyyy", new Date());
        if (isNaN(fromDateObj) || isNaN(uptoDateObj)) {
          return resp.status(400).json({ message: "Invalid date format" });
        }
        // Calculate the number of days
        const numberOfDays = differenceInDays(uptoDateObj, fromDateObj);

        if (book) {
          // Create an IssuedBook entry
          let payload = {
            bookId: _idbook,
            bookName: book.title,
            categoryName: categories.name,
            categoryId: categories.id,
            studentid: _idstudent,
            studentName: student.name,
            librarian: userData.id,
            issueDate: fromDate,
            dueDate: uptoDate,
            qty: qty,
            perDayCharge: perDayCharge,
            numberOfDays: numberOfDays,
          };
          // Due date is set to 5 days from now
          const issuedBook = new IssuedBook(payload);
          await Promise.all([issuedBook.save()]);
          resp.json({ message: "Book issued successfully", issuedBook });
        } else {
          return resp
            .status(404)
            .json({ message: "Book not found in the specified category" });
        }
        // Remove the book from the category
        if (categories.books) {
          categories.books.splice(bookIndex, 1);
          await categories.save();
        } else {
          return resp
            .status(404)
            .json({ message: "Category does not contain books" });
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

  returnBook: async (req, resp, next) => {
    const { _idbook, _idstudent } = req.body;
    try {
      // Extract user data
      const userData = extractUserData(req);
      console.log(userData);

      // Check if the user is a librarian
      if (userData.role === "librarian") {
        // Find the issued book
        const issuedBook = await IssuedBook.findOne({
          bookId: _idbook,
          studentid: _idstudent,
          returnDate: null, // Assuming you have a returnDate field in IssuedBook to track returns
        });

        if (!issuedBook) {
          return resp.status(404).json({ message: "Issued book not found" });
        }

        // Calculate charges based on the period from issue date to now
        const fromDateObj = parse(
          issuedBook.issueDate,
          "dd/MM/yyyy",
          new Date()
        );
        const currentDate = new Date();
        const numberOfDays = differenceInDays(currentDate, fromDateObj);
        const totalCharge = numberOfDays * issuedBook.perDayCharge;

        // // Update the issued book with return date and charges
        // issuedBook.returnDate = currentDate;
        // issuedBook.charges = totalCharge;
        // await issuedBook.save();

        let studentsbooks = {
          bookId: _idbook,
          bookName: issuedBook.bookName,
          categoryName: issuedBook.categoryName,
          categoryId: issuedBook.categoryId,
          studentid: _idstudent,
          studentName: issuedBook.studentName,
          librarian: issuedBook.librarian,
          issueDate: issuedBook.issueDate,
          numberOfDays:numberOfDays,
          charges:totalCharge
          
        };
        // Check if the category ID from the issued book is present in the Category collection
        const category = await Category.findById(issuedBook.categoryId);

        if (!category) {
          return resp.status(404).json({ message: "Category not found" });
        }

        // Add the book back to the category
        category.books.push({
          title: issuedBook.bookName,
          // Add other book details as needed
        });

        // Save the category
        await category.save();

        resp.json({
          message: "Book returned successfully",
          issuedBook,
          charges: totalCharge,
        });
        const studentbook = new StudentBook(studentsbooks);
      await Promise.all([studentbook.save()]);
      } else {
        resp.status(403).json({ message: "Only librarians can return books" });
      }
      
    } catch (error) {
      console.error("Error returning book:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
    next();
  },
};
