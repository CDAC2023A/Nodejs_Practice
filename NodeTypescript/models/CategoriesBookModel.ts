import { Document, Schema, Model, model } from "mongoose";

interface IBook {
  title: string;
  author: string;
  publisher: string;
  Totalquantity: number;
  issuedQty: number;
  RemainQty: number;
  perDayCharges: number;
}

interface ICategory extends Document {
  name: string;
  books: IBook[];
  totalBooksCount: number;
  currentBooksCount: number;
}

const bookSchema = new Schema<IBook>({
  title: String,
  author: String,
  publisher: String,
  Totalquantity: Number,
  issuedQty: Number,
  RemainQty: Number,
  perDayCharges: Number,
});

const categorySchema = new Schema<ICategory>({
  name: String,
  books: [bookSchema],
  totalBooksCount: Number,
  currentBooksCount: Number,
});

const Categories: Model<ICategory> = model<ICategory>('CategoryofBooks', categorySchema);

export default Categories;
