import mongoose, { Document, Schema, Model } from "mongoose";

interface IBook extends Document {
  title: string;
}

interface ICategory extends Document {
  name: string;
  totalBooks: IBook[];
  totalBooksCount: number;
  currentBooksCount: number;
  calculateBooksCounts: () => void;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  totalBooks: [
    {
      title: {
        type: String,
        required: true,
      },
    },
  ],
});

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
