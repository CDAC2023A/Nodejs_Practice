import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface User extends Document {
  name: string;
  email: string;
  phone: number;
  password: string;
  dob: string;
  gender: string;
  role: "admin" | "student" | "librarian";
  qrCode: Buffer; // Change the type to Buffer
}

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
    enum: ["admin", "student", "librarian"],
  },
  qrCode: {
    type: Buffer, // Change the type to Buffer
    required: true, // You may adjust the requirement based on your needs
  },
});

UsersRegistrationSchema.plugin(uniqueValidator, {
  message: "{PATH} is already exists",
});

const UserModel = mongoose.model<User>("ndtsqr", UsersRegistrationSchema);

export default UserModel;
