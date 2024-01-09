const Book = require("../models/bookModel");

module.exports = {
  create: async (req, resp) => {
    const book = await Book.create({
      category_id: req.body.category_id,
      books: req.body.books,
    });

    const bookData = await book.save();

    return resp.send(bookData);
  },

  categoryByBook: async (req, resp) => {
    const bookData = await Book.find({ _id: req.body.book_id }).populate('category_id');

    resp.send(bookData);
  },
};
