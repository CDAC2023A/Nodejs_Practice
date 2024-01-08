const express= require('express');

const router= new express.Router;

const Category= require('../controllers/categoryController')
const Book= require('../controllers/bookController')

router.post('/category/create',Category.create);
router.post('/book/create',Book.create);

module.exports=router;