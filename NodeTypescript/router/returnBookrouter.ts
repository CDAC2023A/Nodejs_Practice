import express from "express";
const userRouter: express.Router = express.Router();
import JwtToken from "../token/jwtToken"
import returbBookController from "../controller/returnBookcontroller";



userRouter.post('/returnBook',returbBookController.returnBook,JwtToken.verifyToken)
userRouter.get("/returnBookHistory",returbBookController.returnBookHistory,JwtToken.verifyToken);
export default userRouter;