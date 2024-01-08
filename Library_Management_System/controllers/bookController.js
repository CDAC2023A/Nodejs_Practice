const Book=require('../models/bookModel');

module.exports={
    create:async(req,resp)=>{

        const book= await Book.create({
            category_id:req.body.category_id,
            books:req.body.books   
        });

        const bookData= await book.save();

        return resp.send(bookData)
    }
}