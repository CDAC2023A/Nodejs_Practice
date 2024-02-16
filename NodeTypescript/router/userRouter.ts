import express from "express";
const userRouter: express.Router = express.Router();
import userController from "../controller/userController";
import JwtToken from "../token/jwtToken";
import categoryController from "../controller/categoryController";
import issuedBookController from "../controller/issuedBookController";
import returbBookController from "../controller/returnBookcontroller";

//import bcrypt from "bcryptjs";
userRouter.post("/register", userController.registerUserData);
userRouter.post("/registerqr", userController.registerUserDataQr);
userRouter.post("/registerqrsvg", userController.registerUserSvgQrcode);
userRouter.post("/registerImage", userController.registerUserprofile);
userRouter.get("/list", userController.ShowUserList, JwtToken.generateToken);
userRouter.post("/login", userController.loginUser, JwtToken.generateToken);
userRouter.delete(
  "/delete/:_id",
  userController.deleteUser,
  JwtToken.verifyToken
);
userRouter.put(
  "/update/:_id",
  userController.updateUserData,
  JwtToken.verifyToken
);
//Excel sheet and Pdf
userRouter.get(
  "/userExcelSheet",
  userController.Exportsheet,
  JwtToken.verifyToken
);
userRouter.get("/userPdf", userController.ExportPdf, JwtToken.verifyToken);
userRouter.get(
  "/readexcel",
  userController.ReadExceldata,
  JwtToken.verifyToken
);
userRouter.post(
  "/readexceldynamic",
  userController.ReadExceldatadynamically,
  JwtToken.verifyToken
);
userRouter.post(
  "/readcsvFile",
  userController.ReadCSVDataDynamically,
  JwtToken.verifyToken
);
userRouter.post(
  "/writeExceldata",
  userController.WriteExcelData,
  JwtToken.verifyToken
);

userRouter.post(
  "/createCategory",
  categoryController.createCategoryData,
  JwtToken.verifyToken
);
userRouter.post(
  "/addBooks/",
  categoryController.addBookToCategory,
  JwtToken.verifyToken
);
userRouter.get(
  "/categorylist",
  categoryController.ShowCategorylist,
  JwtToken.verifyToken
);
userRouter.delete(
  "/deleteCategory/:_id",
  categoryController.deleteCategory,
  JwtToken.verifyToken
);

userRouter.post("/issueBook", issuedBookController.issueBook);
userRouter.get(
  "/issuedBookList",
  issuedBookController.issuedBookList,
  JwtToken.verifyToken
);

userRouter.get(
  "/returnBookHistory",
  returbBookController.returnBookHistory,
  JwtToken.verifyToken
);
userRouter.post(
  "/returnBook",
  returbBookController.returnBook,
  JwtToken.verifyToken
);
export default userRouter;
