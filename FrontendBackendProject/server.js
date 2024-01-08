const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var routes = require('./route/routes');
const cors = require('cors');

app.use(cors(
  {
    origin: "http://localhost:4200"
  }

));

mongoose.connect("mongodb://localhost:27017/fbs")
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(9992, function check(err) {
      if (err) {
        console.log("Error starting the server");
      } else {
        console.log("Server started on port 9992");
      }
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error);
  });


app.use(express.json());
app.use(routes);