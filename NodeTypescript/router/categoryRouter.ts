import express from "express";
const categoryRouter: express.Router = express.Router();
import categoryController from "../controller/categoryController";
import JwtToken from "../token/jwtToken"

categoryRouter.post('/create',categoryController.createCategoryData,JwtToken.verifyToken)

export default categoryRouter;