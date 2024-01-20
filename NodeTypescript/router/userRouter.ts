import express from "express";
const userRouter: express.Router = express.Router();
import userController from "../controller/userController";
import JwtToken from "../token/jwtToken"

//import bcrypt from "bcryptjs";
userRouter.post("/register", userController.registerUserData);
userRouter.get("/list", userController.ShowUserList);
userRouter.post("/login", userController.loginUser,JwtToken.generateToken);
userRouter.delete("/delete/:_id", userController.deleteUser,JwtToken.verifyToken);
userRouter.put("/update/:_id", userController.updateUserData,JwtToken.verifyToken);



export default userRouter;

