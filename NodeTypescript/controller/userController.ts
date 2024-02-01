import express from "express";
import excelJS from "exceljs";
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
    const { email, password } = req.body;

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
const updateUserData = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const filter = { _id: req.params._id };
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
    // Check if the email is already associated with another user
    const existingEmailUser = await userRegistration.findOne({
      email,
      _id: { $ne: req.params._id },
    });
    if (existingEmailUser) {
      resp
        .status(400)
        .json({ error: "Email is already associated with another account." });
      return;
    }

    // Check if the phone is already associated with another user
    const existingPhoneUser = await userRegistration.findOne({
      phone,
      _id: { $ne: req.params._id },
    });
    if (existingPhoneUser) {
      resp
        .status(400)
        .json({ error: "Phone is already associated with another account." });
      return;
    }
    const updatedUser = await userRegistration.findOneAndUpdate(filter, {
      email,
      phone,
      password, // You might want to hash the password before storing it
      role,
      gender,
      dob,
      name,
    });

    resp.json({ message: "User data updated successfully", user: updatedUser });
  } catch (error) {
    resp.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const filter = { _id: req.params._id };
  try {
    // Use the verifyToken function from the imported module
    await verifyToken.verifyToken(req, resp, async () => {
      // Continue with your logic after verifying the token
      const decodedToken = req.body.decoded;
      console.log(decodedToken);

      if (
        decodedToken.userData.role === "admin" &&
        decodedToken.userData.id !== req.params._id
      ) {
        let result = await userRegistration.deleteOne(filter);

        if (result.deletedCount > 0) {
          resp.json({
            message: "Data deleted successfully by Admin ",
            data: result,
          });
        } else {
          resp.json({ message: "No data found for deletion" });
        }
        next();
      } else {
        resp
          .status(402)
          .json({ message: "Records will be deleted by admin only" });
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    resp.status(401).json({ error: "Unauthorized" });
  }
};

const Exportsheet = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My users_data");
    worksheet.columns = [
      { header: "S no", key: "s_no" },
      { header: "Name", key: "name" },
      { header: "Phone", key: "phone" },
      { header: "DOB", key: "dob" },
      { header: "Gender", key: "gender" },
      { header: "Role", key: "role" },
    ];
    let counter = 1;
    const UserList = await userRegistration.find();
    UserList.forEach((user: any) => {
      user.s_no = counter;

      worksheet.addRow(user);

      counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    resp.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    resp.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);
    return workbook.xlsx.write(resp).then(() => {
      resp.status(200);
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
const ExportPdf = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const UserList = await userRegistration.find();
    // Create a new PDF document
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    // Pipe the PDF to the response
    resp.setHeader("Content-Type", "application/pdf");
    resp.setHeader("Content-Disposition", "attachment; filename=users.pdf");
    doc.pipe(resp);

    // Add user data to the PDF
    UserList.forEach((user, index) => {
      doc.text(`User ${index + 1}:`);
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Phone:${user.phone}`);
      doc.text(`DOB:${user.dob}`);
      doc.text(`Render:${user.gender}`);
      doc.text(`Role:${user.role}`);
    });

    // End the PDF document
    doc.end();
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

export default {
  registerUserData,
  ShowUserList,
  loginUser,
  deleteUser,
  updateUserData,
  Exportsheet,
  ExportPdf,
};
