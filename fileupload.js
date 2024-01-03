const { Console } = require("console");
const express = require("express");
const multer = require("multer");
const app = express();
const os=require('os')



const uploadF = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads"); //uploads is a folder name
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single('user_file');

app.post("/uploadfile",uploadF, (req, resp) => {
  resp.send("file uploaded successfully");
});

app.listen(5000);
