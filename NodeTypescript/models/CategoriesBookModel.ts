import mongoose, { Document, Schema, Model } from "mongoose";
const book = new mongoose.Schema({
    title: String,
    author: String,
    publisher: String,
    Totalquantity: Number,
    issuedQty:Number,
    RemainQty:Number,
    perDayCharges: Number,
  });
  
  const categorySchema = new mongoose.Schema({
    name: String,
    books: [book], // Array of book subdocuments
    totalBooksCount: Number,
    currentBooksCount: Number,
  });
  
  const Categories = mongoose.model('CategoryofBooks', categorySchema);
  
  export default Categories;