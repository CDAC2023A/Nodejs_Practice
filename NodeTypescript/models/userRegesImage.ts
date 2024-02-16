import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// Define the interface for the user document
interface User extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  dob: string;
  gender: string;
  role: "admin" | "student" | "librarian";
  image: string; // Add an image field
}

// Define the schema for user registration
const UsersRegistrationSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "student", "librarian"], // Define allowed values for role
  },
  image: {
    type: String, // Assuming you store image URLs or filenames
    required: true, // Adjust as per your requirement
  },
});

// Apply uniqueValidator plugin to handle unique constraints
UsersRegistrationSchema.plugin(uniqueValidator, {
  message: "{PATH} is already exists",
});

// Create the UserModel
const UserModel = mongoose.model<User>("ndtsImage", UsersRegistrationSchema);

export default UserModel;
