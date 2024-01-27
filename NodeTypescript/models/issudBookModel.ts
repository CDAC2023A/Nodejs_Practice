// Import necessary modules
import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the IssuedBook document
interface IssuedBook extends Document {
  bookId: string;
  bookName:string;
  categoryId: string;
  categoryName: string;
  studentId: string;
  studentName: string;
  librarianId: string;
  issueDate: string;
  dueDate: string;
  qty: number;
  TotalCharges:number;
  perDayCharge: number;
  numberOfDays: number;
}

// Define the schema for the IssuedBook model
const IssuedBookSchema = new Schema({
  bookId: {
    type: String,
    required: true,
  },
  bookName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  librarianId: {
    type: String,
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
  },
  returnDate: {
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
  TotalCharges: {
    type: Number,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
});

// Create the IssuedBook model
const IssuedBook = mongoose.model<IssuedBook>('IssuedBook', IssuedBookSchema);

// Export the IssuedBook model
export default IssuedBook;
