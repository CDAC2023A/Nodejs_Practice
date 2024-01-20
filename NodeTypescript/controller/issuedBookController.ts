import express from "express";
import Category from "../models/categoryBookModel";
import verifyToken from "../token/jwtToken";
import IssuedBook from "../models/issudBookModel";
import ReturnBook from "../models/returnBookModel";
import userRegistration from "../models/userRegestrationModel";
import mongoose from "mongoose";
import moment from "moment";

const issuedBook = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    await verifyToken.verifyToken(req, resp, async () => {
      const decodedToken = req.body.decoded;

      // Check if the user is a librarian
      if (decodedToken.userData.role !== "librarian") {
        return resp.status(403).send("Only librarians can issue books.");
      }

      const { bookId, studentId, returnDate } = req.body;

      // Check if the book is already issued
      const existingIssuedBook = await IssuedBook.findOne({ bookId: bookId });
      if (existingIssuedBook) {
        return resp.status(400).send("Book is already issued");
      }
      // Find the category containing the book in the database
      const category = await Category.findOne({
        "totalBooks._id": new mongoose.Types.ObjectId(bookId),
      });

      if (!category) {
        return resp.status(404).send("Category not found for the book.");
      }
      if (category.currentBooksCount <= 0) {
        return resp.status(400).send("Not enough books in stock.");
      }

      // Update the current book count in the Category
      await Category.updateOne(
        { _id: category._id },
        { $inc: { currentBooksCount: -1 } }
      );
      // Retrieve student information from the Users collection
      const student = await userRegistration.findOne({
        _id: new mongoose.Types.ObjectId(studentId),
      });

      if (!student) {
        return resp.status(404).send("Student not found.");
      }

      const issueDate: any = moment().format("DD/MM/YYYY");
      const ReturnDate: any = returnDate;

      console.log(issueDate);
      console.log(ReturnDate);

      const issueDateMoment: moment.Moment = moment(issueDate, "DD/MM/YYYY");
      const returnDateMoment: moment.Moment = moment(returnDate, "DD/MM/YYYY");

      const numberOfDays: number = returnDateMoment.diff(
        issueDateMoment,
        "days"
      );
      console.log(numberOfDays);
      const perdayCharges = 5;
      const totalCharges = numberOfDays * perdayCharges;

      // Create a record in the IssuedBooks collection
      const issuedBook = await IssuedBook.create({
        bookId: bookId,
        categoryId: category._id,
        categoryName: category.name,
        studentId: student.id,
        studentName: student.name,
        librarianId: decodedToken.userData.id,
        issueDate: issueDate,
        returnDate: returnDate,
        TotalCharges: totalCharges,
        perDayCharge: perdayCharges,
        qty: 1,
        numberOfDays: numberOfDays,
      });

      resp.send(issuedBook);

      next();
    });
  } catch (error) {
    resp.status(500).send("Internal Server Error");
  }
};

// Create a new route for returning a book
const returnBook = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { _idbook, _idstudent } = req.body;
    await verifyToken.verifyToken(req, resp, async () => {
      const decodedToken = req.body.decoded;

      // Check if the user is a librarian
      if (decodedToken.userData.role !== "librarian") {
        return resp.status(403).send("Only librarians can return books.");
      }
      const issuedBook: any = await IssuedBook.findOne(_idbook);
      const issueDate: any = issuedBook.issueDate;
      const ReturnDate: any = moment().format("DD/MM/YYYY");
      const issueDateMoment: moment.Moment = moment(issueDate, "DD/MM/YYYY");
      const returnDateMoment: moment.Moment = moment(ReturnDate, "DD/MM/YYYY");
      const numberOfDays: number = returnDateMoment.diff(
        issueDateMoment,
        "days"
      );
      const perDaycharges = 5;
      const totalCharges = numberOfDays * perDaycharges;
      console.log(issuedBook);
      let ReturnBookData = {
        BookId: issuedBook.bookId,
        CategoryId: issuedBook.categoryId,
        CategoryName: issuedBook.categoryName,
        StudentId: issuedBook.studentId,
        StudentName: issuedBook.studentName,
        LibrarianId: issuedBook.librarianId,
        IssueDate: issueDateMoment,
        DueDate: returnDateMoment,
        Qty: issuedBook.qty,
        PerDayCharge: perDaycharges,
        NumberOfDays: numberOfDays,
        TotalCharges: totalCharges,
      };
      const returnbookstore = new ReturnBook(ReturnBookData);
      await Promise.all([returnbookstore.save()]);
      // Delete the issued book from the IssuedBooks collection
      resp.send(returnbookstore);

      // Update the current book count in the Category
      await Category.updateOne(
        { _id: issuedBook.categoryId },
        { $inc: { currentBooksCount: 1 } }
      );
      await IssuedBook.findByIdAndDelete(issuedBook._id);

      console.log("Book returned successfully.");

      next();
    });
  } catch (error) {
    resp.status(500).send("Internal Server Error");
  }
};

export default { issuedBook, returnBook };
