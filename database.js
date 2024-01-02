const { error, warn } = require("console");
// const mySql=require("mysql")
//require('dotenv').config();

const mysql = require("mysql2");

const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydbspring",

  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE
});

connect.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.warn("connected successfully");
  }
});



connect.query("select * from users", (err, result) => {
  console.warn("result", result);
});
