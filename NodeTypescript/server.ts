import express from 'express';
import userRouter from './router/userRouter';
import returnBookrouter from './router/returnBookrouter';
import mongoose from 'mongoose';
import cors from 'cors'; 

const app: express.Application = express();

app.use(cors({
  origin: "*"
}));

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

app.use('/user', userRouter);

const port: number = 5000;

app.listen(port, () => console.log(`Express server is started at http://localhost:${port}`));
