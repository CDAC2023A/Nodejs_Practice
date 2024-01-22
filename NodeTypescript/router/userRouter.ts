import express from "express";
const userRouter: express.Router = express.Router();
import userController from "../controller/userController";
import JwtToken from "../token/jwtToken"
import categoryController from "../controller/categoryController";
import issuedBookController from "../controller/issuedBookController";

//import bcrypt from "bcryptjs";
userRouter.post("/register", userController.registerUserData);
userRouter.get("/list", userController.ShowUserList);
userRouter.post("/login", userController.loginUser,JwtToken.generateToken);
userRouter.delete("/delete/:_id", userController.deleteUser,JwtToken.verifyToken);
userRouter.put("/update/:_id", userController.updateUserData,JwtToken.verifyToken);


userRouter.post('/createCategory',categoryController.createCategoryData,JwtToken.verifyToken);
userRouter.post("/addBooks/",categoryController.addBookToCategory,JwtToken.verifyToken);
userRouter.get("/categorylist",categoryController.ShowCategorylist,JwtToken.verifyToken);
userRouter.delete("/deleteCategory/:_id",categoryController.deleteCategory,JwtToken.verifyToken);

userRouter.post('/issueBook',issuedBookController.issueBook)
userRouter.post('/returnBook',issuedBookController.returnBook,JwtToken.verifyToken)
userRouter.get("/returnBookHistory",issuedBookController.returnBookHistory,JwtToken.verifyToken);

export default userRouter;

