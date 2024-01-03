const mongoose = require("mongoose");

//connect with database
mongoose.connect("mongodb://localhost:27017/e-commerce");

///writing schema here
const ProductSchema = mongoose.Schema({
  username: String,
  password: Number,
});

const authorizationdata = [];

async function authorize(req, resp, next) {
  const ProductsModel = mongoose.model("users", ProductSchema);
  const { username, password } = req.query;
  const data = await ProductsModel.find();
  const filterdata = data.filter(
    (item) => item.username === username && item.password === parseInt(password)
  );
  if (filterdata.length > 0) {
    const filteredDataWithoutPassword = filterdata.map(({ password, ...rest }) => rest);
    authorizationdata.push(...filteredDataWithoutPassword);
    
    console.log(authorizationdata);
    next();
  } else {
    resp.send("Unathaurized data");
  }
}

module.exports = { authorize, authorizationdata };
