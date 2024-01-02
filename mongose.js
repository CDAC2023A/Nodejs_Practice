const { string } = require("joi");
const mongoose = require("mongoose");

//connect with database
mongoose.connect("mongodb://localhost:27017/e-commerce");

///writing schema here
const ProductSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  category: String,
});

//save operation or add data in database(model)
const saveInDb = async () => {
  const ProductsModel = mongoose.model("products", ProductSchema);

  let data = new ProductsModel({
    name: "z",
    brand: "samsung",
    price: 60000,
    category: "mobile",
    battery: 5000,
  });
  let result = await data.save();
  console.log(result);
};

//update the data

const updateInDb = async () => {
  const ProductsModel = mongoose.model("products", ProductSchema);
  let data = await ProductsModel.updateOne(
    { name: "z" },
    {
      $set: { price: 24000, name: "zfold" },
    }
  );
  if (data.modifiedCount === 0) {
    console.log("The data you insert is already exists");
  } else if (data.modifiedCount === 1 || data.matchedCount === 1) {
    console.log("The data is updated");
  } else if (data.matchedCount === 0 || data.modifiedCount === 0) {
    console.log("The data you entered is not matched");
  }
};

const deleteInDb = async () => {
  const ProductsModel = mongoose.model("products", ProductSchema);
  let data = await ProductsModel.deleteOne({ name: "zf0ld" });
  if (data.deletedCount === 0) {
    console.log("The name you entered is not available");
  } else if (data.deletedCount === 1) {
    console.log("deleted successfully");
  }
  console.log(data);
};
const findInDb = async () => {
  const ProductsModel = mongoose.model("products", ProductSchema);
  let data = await ProductsModel.find(
    {name:"s20"}
  );

  console.log(data);
};

// here you have to call the method
//deleteInDb();
findInDb();
