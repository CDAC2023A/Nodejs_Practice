const mongoose=require('mongoose');

///writing schema here
const ProductSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: Number,
    dob: String,
    gender: String,
    role: {
      type: String,
      enum: ["admin", "student", "librarian"],
    },
  });

  module.exports = mongoose.model("users", ProductSchema);