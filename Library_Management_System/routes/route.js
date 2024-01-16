const express= require('express');
const app= express();
const router= new express.Router;

const Category= require('../controllers/categoryController')
const Book= require('../controllers/bookController')
const Users=require('../controllers/usersController')
const JwtToken=require('../tokenMiddleware/jwtToken');



router.post('/category/create',Category.create,JwtToken.verifyToken);   
router.get('/category/list',Category.categorylist);
router.put('/category/update/:_id',Category.updateData,JwtToken.verifyToken);
router.put('/category/addbook/:_id',Category.AddbookeData,JwtToken.verifyToken);
router.delete('/category/delete/:_id',Category.deleteData,JwtToken.verifyToken);

router.post("/users/create",Users.createData)
router.get("/users/list", Users.Showdata,JwtToken.verifyToken)
router.post("/users/login",Users.loginauthorize,JwtToken.generateToken)
router.put("/users/update/:_id",Users.updateData,JwtToken.verifyToken)
router.delete("/users/delete/:_id",Users.deleteData,JwtToken.verifyToken);

router.post('/librarian/issue_book', Users.issueBook,JwtToken.verifyToken);
router.post('/librarian/return_book',Users.returnBook,JwtToken.verifyToken);



function invalidPath(req,resp,next){
    resp.status(404).json({message:"Invalid path request please check the path again"})
}

function errorHandler(err,req,resp,next){
    resp.header('content-type','application/json');
    const status=err.status|| 400;
    resp.status(status).json({error:err.message});
}

//router.use(invalidPath);
//router.use(errorHandler);

module.exports=router;      