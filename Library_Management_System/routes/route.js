const express= require('express');

const router= new express.Router;

const Category= require('../controllers/categoryController')
const Book= require('../controllers/bookController')
const Users=require('../controllers/usersController')
const JwtToken=require('../tokenMiddleware/jwtToken');



router.post('/category/create',Category.create,JwtToken.verifyToken);   
router.get('/category/list',Category.categorylist);
router.put('/category/update/:_id',Category.updateData,JwtToken.verifyToken);
router.delete('/category/delete/:_id',Category.deleteData,JwtToken.verifyToken);




router.post("/users/create",Users.createData)
router.get("/users/list", Users.Showdata)
router.post("/users/login",Users.loginauthorize,JwtToken.generateToken)
router.put("/users/update/:_id",Users.updateData,JwtToken.verifyToken)
router.delete("/users/delete/:_id",Users.deleteData,JwtToken.verifyToken)
router.post('/librarian/issue_book/:_idcategory/:_idbook/:_idstudent', Users.issueBook,JwtToken.verifyToken);

module.exports=router;      