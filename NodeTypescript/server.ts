import express from 'express';
const app:express.Application =express();

import userRouter from './router/userRouter';
import mongoose from 'mongoose';


//const localhost :string='127.0.0.1';
const port:number=5000; 


// MongoDB connection setup
const mongoURI: string = 'mongodb://localhost:27017/nodejsTypescript';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user',userRouter);

app.listen(port, () => console.log(`Express server is started at http://localhost:${port}`));
