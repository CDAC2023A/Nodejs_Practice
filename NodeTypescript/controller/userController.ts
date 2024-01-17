import express from "express";
import { body, validationResult } from "express-validator";
import { RegistrationData, LoginData } from "../Interfces/userReges"; // Adjust the path accordingly
import userRegistration from "../models/userRegestrationModel";
import verifyToken from "../token/jwtToken";
const app = express();
app.use(express.json());


const registerUserData = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // Validation rules
  const validationRules = [
    body("email").isEmail().withMessage("Email is required"),
    body("phone").isLength({ min: 10 }).withMessage("Phone is required"),
    body("password").isLength({ min: 5 }).withMessage("Password is required"),
    body("role").not().isEmpty().withMessage("Role is required"),
    body("gender").not().isEmpty().withMessage("Gender is required"),
    body("dob").not().isEmpty().withMessage("DOB is required"),
    body("name").not().isEmpty().withMessage("Name is required"),
  ];

  // Apply validation rules
  await Promise.all(validationRules.map((validation) => validation.run(req)));
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(400).json({ errors: errors.array() });
  }
  const { email, phone, password, role, gender, dob, name } =
    req.body as RegistrationData;
  try {
    // Check if the email or phone already exists
    const existingUser = await userRegistration.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      resp
        .status(400)
        .json({ message: "Email or phone number already exists." });
      return;
    }

    // Create a new user if not already exists
    const data = await userRegistration.create({
      email,
      phone,
      password,
      role,
      gender,
      dob,
      name,
    });

    resp.json({ message: "Data created successfully", data });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (
      error.code === 11000 ||
      error.name === "MongoError" ||
      error.code === 11001
    ) {
      resp
        .status(400)
        .json({ message: "Email or phone number already exists." });
    }

    resp.status(500).json({ message: "Internal server error" });
  }

  next();
};

const ShowUserList = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const UserList = await userRegistration.find();
    resp.json({ message: "Data list get successfully", UserList });
    next();
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

const loginUser = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginData;

    // Retrieve the user with the given email
    const user = await userRegistration.findOne({ email });

    if (user) {
      const passwordMatch = password === user.password;
      if (passwordMatch) {
        // Authentication successful
        req.body = {
          id: user._id.toString(),
          name: user.name,
          role: user.role,
          email: user.email,
        };
        next();
      } else {
        resp.status(401).send("Unauthorized: Incorrect password");
      }
    } else {
      resp.status(401).send("Unauthorized: User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
const deleteUser = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const filter = { _id: req.params._id };
  try {
    const decodedToken = req.body.decoded;

    if (decodedToken.role === "admin" && decodedToken.id !== req.params._id) {
      let data = await userRegistration.deleteOne(filter);
      if (data.deletedCount === 1) {
        resp.json({ message: "Data deleted successfully Admin ", data });
      } else if (data.deletedCount === 0) {
        resp.json({ message: "No Id present Admin" });
      } else {
        resp.json({ message: "No" });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    resp.status(401).json({ error: "Unauthorized" });
  }
};
export default {
  registerUserData,
  ShowUserList,
  loginUser,
  deleteUser,
};
