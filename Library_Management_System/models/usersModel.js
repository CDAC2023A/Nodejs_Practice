const mongoose=require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
///writing schema here
const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        uniqueCaseInsensitive:true,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    role: {
      type: String,
      required:true,
      enum: ["admin", "student", "librarian"],
    },
  });
  UsersSchema.plugin(uniqueValidator,{message:'{PATH} is already exists'});

  module.exports = mongoose.model("users", UsersSchema);