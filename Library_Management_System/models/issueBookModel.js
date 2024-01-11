// models/issuedBook.js
const mongoose = require("mongoose");

const issuedBookSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
  },
  // categoryName: {
  //   type: String,
  //   required: true,
  // },
  bookId: {
    type:String, // or ObjectId, based on your model structure
    required: true,
  },
  // bookName: {
  //   type: String, // or ObjectId, based on your model structure
  //   required: true,
  // },
  studentid: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  librarian: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const IssuedBook = mongoose.model("IssuedBook", issuedBookSchema);

module.exports = IssuedBook;
