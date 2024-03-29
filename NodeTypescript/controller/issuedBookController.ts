import express from "express";
import verifyToken from "../token/jwtToken";
import IssuedBook from "../models/issudBookModel";
import ReturnBook from "../models/returnBookModel";
import moment from "moment";
import Categories from "../models/CategoriesBookModel";
import UserReges from "../models/userRegestrationModel";

//IssueBook list
const issuedBookList = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const IssuedBooklist = await IssuedBook.find();
    resp.json({ message: "Data list get successfully", IssuedBooklist });
    next();
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

//Issue single book
const issueBook = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      const decodedToken = req.body.decoded;

      //Check if the user is a librarian------------------
      if (decodedToken.userData.role !== "librarian") {
        return resp.status(403).send("Only librarians can issue books.");
      }
      const { studentId, bookId, returnDate } = req.body;

      // Check if the student exists---------------
      const student = await UserReges.findById(studentId);
      if (!student) {
        return resp.status(400).send("Student not found");
      }
      // Check if the book and student exist--------------------
      const category = await Categories.findOne({ "books._id": bookId });
      console.log(category);
      if (!category) {
        return resp.status(400).send("Book not found in the category");
      }
      //Find the book in the category
      const book: any = category.books.find(
        (b: any) => b._id.toString() === bookId
      );

      //Check if there are enough remaining quantities to issue
      if (book.RemainQty <= 0) {
        return resp.status(400).send("Book is out of stock");
      }
      const existingIssuedBook: any = await IssuedBook.findOne({
        studentId: studentId,
        bookId: bookId,
      });

      if (existingIssuedBook) {
        console.log("Student has already issued this book");
        return resp.status(400).send("Student has already issued this book");
      }

      const issueDate: any = moment().format("DD/MM/YYYY");
      const issueDateMoment: moment.Moment = moment(issueDate, "DD/MM/YYYY");
      const returnDateMoment: moment.Moment = moment(returnDate, "DD/MM/YYYY");
      const numberOfDays: number = returnDateMoment.diff(
        issueDateMoment,
        "days"
      );
      const totalCharges = numberOfDays * book.perDayCharges;

      // Update quantities and issue the book
      book.RemainQty -= 1;
      book.issuedQty += 1;

      //Save the updated category
      await category.save();

      // Create a record in the IssuedBooks collection
      const issuedBookData = await IssuedBook.create({
        bookId: bookId,
        bookName: book.title,
        categoryId: category._id,
        categoryName: category.name,
        studentId: student.id,
        studentName: student.name,
        librarianId: decodedToken.userData.id,
        issueDate: issueDateMoment,
        returnDate: returnDateMoment,
        TotalCharges: totalCharges,
        perDayCharge: book.perDayCharges,
        qty: 1,
        numberOfDays: numberOfDays,
      });

      //Send a success response
      resp.json({
        success: true,
        message: "Book issued successfully",
        issuedBook: book,
        issuedBookData,
      });

      next();
    });
  } catch (error) {
    // Handle other errors
    resp.status(500).send("Internal Server Error");
  }
};

const returnBookHistory = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const BookHistoryList = await ReturnBook.find();
    resp.json({ message: "Data list get successfully", BookHistoryList });
    next();
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

const returnBook = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      const decodedToken = req.body.decoded;
      // Check if the user is a librarian
      if (decodedToken.userData.role !== "librarian") {
        return resp.status(403).send("Only librarians can return books.");
      }
      // Extract necessary data from the request
      const { studentId, bookId } = req.body;

      // Find the issued book record
      const issuedBook: any = await IssuedBook.findOne({
        studentId: studentId,
        bookId: bookId,
      });
      console.log("Issued Book:", issuedBook);

      if (!issuedBook) {
        return resp
          .status(400)
          .send("No active issuance found for the given student and book.");
      }

      //console.log(returnDate);

      // Check if the book and student exist
      const category = await Categories.findOne({ "books._id": bookId });
      //console.log(category);
      if (!category) {
        return resp.status(400).send("Book not found in the category");
      }
      const book: any = category.books.find(
        (b: any) => b._id.toString() === bookId
      );

      //Check if there are enough remaining quantities to issue
      if (book.RemainQty <= 0) {
        return resp.status(400).send("Book is out of stock");
      }
      book.RemainQty += 1;
      book.issuedQty -= 1;
      //book calculation and date
      const issueDate: any = issuedBook.issueDate;
      const ReturnDate: any = moment().format("DD/MM/YYYY");
      const returnDateMoment: moment.Moment = moment(ReturnDate, "DD/MM/YYYY");
      const numberOfDays: any = returnDateMoment.diff(issueDate, "days");
      console.log(numberOfDays);

      console.log("Return Date:", returnDateMoment.format("DD/MM/YYYY"));

      const perDaycharges: number = issuedBook.perDayCharge;
      const totalCharges: number = numberOfDays * perDaycharges;
      // Save the updated category and issued book
      let ReturnBookData = {
        BookId: issuedBook.bookId,
        CategoryId: issuedBook.categoryId,
        CategoryName: issuedBook.categoryName,
        StudentId: issuedBook.studentId,
        LibrarianId: issuedBook.librarianId,
        IssueDate: issueDate,
        DueDate: returnDateMoment,
        Qty: issuedBook.qty,
        PerDayCharge: perDaycharges,
        // PerDayCharge: perDaycharges,
        // NumberOfDays: numberOfDays,
        // TotalCharges: totalCharges,
      };
      const returnbookstore = new ReturnBook(ReturnBookData);
      await Promise.all([returnbookstore.save()]);

      //Save the updated category
      await category.save();
      // Send a success response
      resp.json({
        success: true,
        message: "Book returned successfully",
        returnedBook: book,
        returnedBookData: issuedBook,
      });

      const deletedDocument = await IssuedBook.findOneAndDelete({
        studentId: studentId,
        bookId: bookId,
      });
      console.log("Deleted Document:", deletedDocument);

      next();
    });
  } catch (error) {
    // Handle other errors
    resp.status(500).send("Internal Server Error");
  }
};
export default { returnBook, issueBook, returnBookHistory, issuedBookList };
