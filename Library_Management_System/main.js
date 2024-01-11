const express=require('express');
const mongoose = require("mongoose");
const bodyParse=require('body-parser');
const bodyParser = require("body-parser");
const app =express();
const cors = require('cors');

app.use(cors(
  {
    origin: "*"
  }

));



app.use(bodyParse.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes/route'))
//connect with database
mongoose.connect("mongodb://localhost:27017/library_management_system");   

app.listen(5000), ()=>console.log('server on!');
