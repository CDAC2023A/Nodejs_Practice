// models/issuedBook.js
const mongoose = require("mongoose");

const issuedBookSchema = new mongoose.Schema({
  bookId: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  bookName: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  studentid: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  studentName: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  librarian: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  perDayCharge: {
    type: Number,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
});

const IssuedBook = mongoose.model("IssuedBook", issuedBookSchema);

module.exports = IssuedBook;
