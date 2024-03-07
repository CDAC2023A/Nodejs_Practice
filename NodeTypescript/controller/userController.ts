import express from "express";
import excelJS from "exceljs";
import { body, validationResult } from "express-validator";
import { RegistrationData, LoginData } from "../Interfces/userReges"; // Adjust the path accordingly
import userRegistration from "../models/userRegestrationModel";
import UserQrModel, { User } from "../models/userRegesQr";
import UsersvgModel from "../models/userregQrsvg";
import UserImagemodel from "../models/userRegesImage";
import verifyToken from "../token/jwtToken";
import fs from "fs";
import qr from "qrcode";
import XLSX from "xlsx";
const app = express();
app.use(express.json());
import multer from "multer";
import csvtojson from "csvtojson";
import path from "path";
import pdf from "pdfkit";
import excel from "exceljs";
import generateQRCodeSVG from "../SVG/svggenerate";
import UserModel from "../models/userRegestrationModel";
import OTPModel from "../models/otpModel";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import dotenv from "dotenv";

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

const registerUserDataQr = async (
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
    return;
  }

  const { email, phone, password, role, gender, dob, name } = req.body;

  try {
    // Check if the email or phone already exists
    const existingUser = await UserQrModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      resp
        .status(400)
        .json({ message: "Email or phone number already exists." });
      return;
    }

    // Generate QR code for the user
    const qrCodeText = JSON.stringify({
      email,
      phone,
      role,
      gender,
      dob,
      name,
    });

    // Generate QR code asynchronously and get the PNG buffer
    const qrCodeBase64 = await qr.toBuffer(qrCodeText, { type: "png" });
    // Convert the buffer to a base64 string
    const code = qrCodeBase64.toString("base64");
    // Save QR code Data URL directly to database
    const newUser: User = await UserQrModel.create({
      email,
      phone,
      password,
      role,
      gender,
      dob,
      name,
      qrCode: qrCodeBase64,
    });
    // Save PNG image locally
    const qrfilePath = path.join(__dirname, "qr_codes", `${email}.png`);
    fs.writeFileSync(qrfilePath, qrCodeBase64);

    // Create a PDF document
    const pdfDir = path.join(__dirname, "user_pdfdata");
    const pdfFileName = `${email}_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    const doc = new pdf();
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add user details to the PDF
    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Phone: ${phone}`);
    doc.text(`Role: ${role}`);
    doc.text(`Gender: ${gender}`);
    doc.text(`DOB: ${dob}`);

    // Add spacing
    doc.moveDown();
    // Embed QR code image in the PDF
    doc.image(qrfilePath, { width: 200 });
    // Finalize the PDF
    doc.end();

    // Ensure Excel file exists
    const excelFilePath = path.join(__dirname, "user_excels", "user_data.xlsx");
    if (!fs.existsSync(excelFilePath)) {
      // Create a new workbook
      const workbook = new excel.Workbook();
      // Add a worksheet
      const worksheet = workbook.addWorksheet("Users");
      // Add headers
      worksheet.addRow([
        "Name",
        "Email",
        "Phone",
        "Role",
        "Gender",
        "DOB",
        "Qrcode",
      ]);
      // Save the workbook
      await workbook.xlsx.writeFile(excelFilePath);
    }

    // Add user data to the Excel file
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    let worksheet = workbook.getWorksheet("Users");

    // If worksheet doesn't exist, create one
    if (!worksheet) {
      worksheet = workbook.addWorksheet("Users");
      worksheet.addRow([
        "Name",
        "Email",
        "Phone",
        "Role",
        "Gender",
        "DOB",
        "Qrcode",
      ]);
    }

    // Add user data
    worksheet.addRow([name, email, phone, role, gender, dob, qrfilePath]);

    // Save the workbook
    await workbook.xlsx.writeFile(excelFilePath);

    resp.json({
      message: "Data created successfully",
      qrCode: code,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    resp.status(500).json({ message: "Internal server error" });
  }

  next();
};
const registerUserSvgQrcode = async (
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
    return;
  }

  const { email, phone, password, role, gender, dob, name } =
    req.body as RegistrationData;

  try {
    // Check if the email or phone already exists
    const existingUser = await UsersvgModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      resp
        .status(400)
        .json({ message: "Email or phone number already exists." });
      return;
    }

    // Generate SVG QR code
    const svgQRCode = await generateQRCodeSVG({ email, phone, name });

    // Create a new user if not already exists
    const data = await UsersvgModel.create({
      email,
      phone,
      password,
      role,
      gender,
      dob,
      name,
      qrCode: svgQRCode,
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
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for storing uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set a unique filename for the uploaded file
  },
});
const upload = multer({ storage: storage });
const registerUserprofile = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // Multer middleware to handle file uploads
  upload.single("image")(req, resp, async (err: any) => {
    if (err) {
      console.error("Error uploading image:", err);
      resp.status(500).json({ message: "Internal server error" });
      return;
    }

    // Validation rules for other form data
    const validationRules = [
      body("email").isEmail().withMessage("Email is required"),
      body("phone").isLength({ min: 10 }).withMessage("Phone is required"),
      body("password").isLength({ min: 5 }).withMessage("Password is required"),
      body("role").not().isEmpty().withMessage("Role is required"),
      body("gender").not().isEmpty().withMessage("Gender is required"),
      body("dob").not().isEmpty().withMessage("DOB is required"),
      body("name").not().isEmpty().withMessage("Name is required"),
    ];

    // Apply validation rules for other form data
    await Promise.all(validationRules.map((validation) => validation.run(req)));

    // Check for validation errors for other form data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      resp.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, phone, password, role, gender, dob, name } = req.body as {
      email: string;
      phone: number;
      password: string;
      role: string;
      gender: string;
      dob: string;
      name: string;
    };

    try {
      // Check if the email or phone already exists
      const existingUser = await UserImagemodel.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        resp
          .status(400)
          .json({ message: "Email or phone number already exists." });
        return;
      }

      const image = req.file; // Get the uploaded image file
      if (!image) {
        resp.status(400).json({ message: "Image is required." });
        return;
      }

      // Create a new user with image
      const data = await UserModel.create({
        email,
        phone,
        password,
        role,
        gender,
        dob,
        name,
        image: image.filename, // Assuming you're saving the filename in the database
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
        return;
      }

      resp.status(500).json({ message: "Internal server error" });
    }

    next();
  });
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

function convertToObject(data: any) {
  const result: any = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const keys = key.split(".");
      let nested = result;

      for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i];
        if (i === keys.length - 1) {
          if (currentKey === "documents" || currentKey === "partnerIds") {
            nested[currentKey] = data[key]
              .split(/\r?\n/)
              .map((item: string) => item.trim());
          } else if (currentKey === "monthlySolarAccess") {
            nested[currentKey] = data[key]
              .split(/\r?\n/)
              .map((item: string) => item.trim());
          } else if (currentKey === "monthly") {
            nested[currentKey] = data[key]
              .split(/\r?\n/)
              .map((item: string) => item.trim());
          } else if (currentKey === "yearly") {
            nested[currentKey] = parseInt(data[key], 10);
          } else if (currentKey === "devices") {
            const deviceTypes = [
              "evChargers",
              "meters",
              "panels",
              "batteries",
              "inverters",
              "optimizers",
            ];

            for (const deviceType of deviceTypes) {
              const deviceData = data[key][deviceType];

              if (deviceData && deviceData.modelName) {
                const modelNames = deviceData.modelName.split(/\r?\n/);
                const manufacturers = deviceData.manufacturer.split(/\r?\n/);
                const productIds = deviceData.productId.split(/\r?\n/);

                if (!nested[currentKey][deviceType]) {
                  nested[currentKey][deviceType] = [];
                }

                for (let j = 0; j < modelNames.length; j++) {
                  nested[currentKey][deviceType].push({
                    modelName: modelNames[j].trim(),
                    manufacturer: manufacturers[j]?.trim() ?? "",
                    productId: productIds[j]?.trim() ?? "",
                  });
                }
              }
            }
          } else {
            nested[currentKey] = data[key];
          }
        } else {
          nested[currentKey] = nested[currentKey] || {};
          nested = nested[currentKey];
        }
      }
    }
  }

  return result;
}

const ReadExceldata = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const workbook = XLSX.readFile("tpo-asset-bulk-upload.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: "",
    });
    const finalItems = jsonData.map((item) => {
      return convertToObject(item);
    });

    // Print JSON data
    console.log(jsonData);
    resp.json({
      message: "Data read successfully ",
      data: finalItems,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
const WriteExcelData = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const jsonData = req.body.data;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    resp.setHeader("Content-Disposition", "attachment; filename=export.xlsx");
    resp.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the Excel file buffer as the response
    resp.send(excelBuffer);
  } catch (error) {
    console.error("Error writing Excel file:", error);
    resp.status(500).json({ message: "Error writing Excel file" });
    next(error);
  }
};

const ReadExceldatadynamically = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const upload = multer();

    upload.single("excelFile")(req, resp, (err: any) => {
      if (err) {
        // Multer or file upload error
        console.error("File upload error:", err);
        resp.status(400).json({ message: "File upload error" });
        return;
      }

      if (!req.file) {
        // No file uploaded
        resp.status(400).json({ message: "No file uploaded" });
        return;
      }

      // File uploaded successfully
      console.log("File uploaded:", req.file);

      // Read the uploaded Excel file
      try {
        const filePath = req.file.path;
        console.log("File path:", filePath);

        const workbook = XLSX.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0]; // assuming data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          defval: "",
        });
        const finalItems = jsonData.map((item) => {
          return convertToObject(item);
        });
        // Print JSON data
        console.log("Excel data:", jsonData);
        resp.json({
          message: "File uploaded and Excel data read successfully",
          data: finalItems,
        });
      } catch (readError) {
        console.error("Error reading Excel file:", readError);
        resp.status(500).json({ message: "Error reading Excel file" });
      }
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

const ReadCSVDataDynamically = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const upload = multer();

    upload.single("csvFile")(req, resp, (err: any) => {
      if (err) {
        // Multer or file upload error
        console.error("File upload error:", err);
        resp.status(400).json({ message: "File upload error" });
        return;
      }
      if (!req.file) {
        // No file uploaded
        resp.status(400).json({ message: "No file uploaded" });
        return;
      }

      // File uploaded successfully
      console.log("File uploaded:", req.file);

      // Read the uploaded CSV file
      csvtojson()
        .fromString(req.file.buffer.toString()) // Convert buffer to string and parse CSV
        .then((jsonData: any) => {
          // Print JSON data
          console.log("CSV data:", jsonData);
          resp.json({
            message: "File uploaded and CSV data read successfully",
            data: jsonData,
          });
        });
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    resp.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};

const generateOtp = async (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const { mobileNumber } = req.body;
    // Initialize Twilio client
    const accountSid = "AC646e593bacca8bb167462031d0c40f62";
    const authToken = "5226920a687c9fbe6c7362138250a7e7";
    const client = twilio(accountSid, authToken);
    // Generate a 6-digit OTP using numbers only
    const otp = otpGenerator.generate(6, { digits: true });

    // Save OTP to the database
    const otpDoc = new OTPModel({
      mobileNumber,
      otp,
    });

    await otpDoc.save(); // Corrected: save should be called on model instance, not schema

    // Send OTP to the mobile number using Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+1 484 365 2550",
      to: mobileNumber,
    });
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    resp.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error handling file upload:", error);
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
  ReadExceldata,
  ReadExceldatadynamically,
  ReadCSVDataDynamically,
  WriteExcelData,
  registerUserDataQr,
  registerUserSvgQrcode,
  registerUserprofile,
  generateOtp,
};
