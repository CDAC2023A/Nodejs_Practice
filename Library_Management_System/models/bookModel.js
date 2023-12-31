const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,  // Fix typo here
        ref: 'category'
    },
    books: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("book", bookSchema);
