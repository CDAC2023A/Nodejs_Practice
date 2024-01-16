// models/issuedBook.js
const mongoose = require("mongoose");

const studentBookSchema = new mongoose.Schema({
  studentid: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  studentName: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  bookId: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  bookName: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  categoryName: {
    type: String,
    require: true,
  },
  categoryId: {
    type: String,
    require: true,
  },
  librarian: {
    type: String, // or ObjectId, based on your model structure
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  charges:{
    type:String,
    require:true
  }
});

const StudentBook = mongoose.model("StudentBookdata", studentBookSchema);

module.exports = StudentBook;
