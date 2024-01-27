import express from "express";
import verifyToken from "../token/jwtToken";
import IssuedBook from "../models/issudBookModel";
import ReturnBook from "../models/returnBookModel";
import moment from "moment";
import Categories from "../models/CategoriesBookModel";
import UserReges from "../models/userRegestrationModel";



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
          BookName:issuedBook.bookName,
          CategoryId: issuedBook.categoryId,
          CategoryName: issuedBook.categoryName,
          StudentId: issuedBook.studentId,
          StudentName:issuedBook.studentName,
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
  export default { returnBook, returnBookHistory };