const mongoose = require("mongoose");

///writing schema here
const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  category: String,
});

module.exports = mongoose.model("products", ProductSchema);
