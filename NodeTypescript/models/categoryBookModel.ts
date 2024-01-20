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
  totalBooksCount: {
    type: Number,
    default: 0,
  },
  currentBooksCount: {
    type: Number,
    default: 0,
  },
});

// Define a pre-save hook to automatically update currentBooks
categorySchema.pre<ICategory>("save", function (next) {
  // Ensure totalBooks and currentBooks have the same IDs
  this.totalBooks.forEach((book) => {
    if (!book._id) {
      book._id = new mongoose.Types.ObjectId();
    }
  });
 
  next();
});

// Define a method to calculate total and current books count
categorySchema.methods.calculateBooksCounts = function (this: ICategory) {
  this.totalBooksCount = this.totalBooks.length;
  this.currentBooksCount = this.totalBooks.length;
};

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
