const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique:true,
      uniqueCaseInsensitive:true
    },
    books: [
      {
        title: {
          type: String,
          required: true,
        },
      },
    ],
    booksCount: {
        type: Number,
        default: 0
      },
  },
//   {
//     timestamps: true,
//   }
);
categorySchema.methods.calculateBooksCount = function () {
    this.booksCount = this.books.length;
};

categorySchema.pre('save', function (next) {
    this.calculateBooksCount();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
//module.exports = mongoose.model("categories", categorySchema);
