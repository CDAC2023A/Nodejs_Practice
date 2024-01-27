import mongoose, { Document, Schema } from "mongoose";

interface IReturnedBook extends Document {
  BookId: string;
  BookName: string;
  CategoryId: string;
  CategoryName: string;
  StudentId: string;
  StudentName: string;
  LibrarianId: string;
  IssueDate: string;
  DueDate: string;
  Qty: number;
  PerDayCharge: number;
  //   NumberOfDays: number;
  //   TotalCharges:number;
  // Add other fields as needed (all as string)
}

const returnedBookSchema: Schema<IReturnedBook> = new mongoose.Schema({
  BookId: {
    type: String,
    required: true,
  },
  BookName: {
    type: String,
    required: true,
  },
  CategoryId: {
    type: String,
    required: true,
  },
  CategoryName: {
    type: String,
    required: true,
  },
  StudentId: {
    type: String,
    required: true,
  },
  StudentName: {
    type: String,
    required: true,
  },
  LibrarianId: {
    type: String,
    required: true,
  },
  IssueDate: {
    type: String,
    required: true,
  },
  DueDate: {
    type: String,
    required: true,
  },
  Qty: {
    type: Number,
    required: true,
  },
  PerDayCharge: {
    type: Number,
    required: true,
  },
  //   NumberOfDays:{
  //     type:Number,
  //     required:true
  //   },
  //   TotalCharges:{
  //     type:Number,
  //     required:true
  //   }
  // Add other fields as needed (all as string)
});

const ReturnedBook = mongoose.model<IReturnedBook>(
  "ReturnedBook",
  returnedBookSchema
);

export default ReturnedBook;
