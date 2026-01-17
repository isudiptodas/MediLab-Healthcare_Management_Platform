import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userAuth from './routes/user/userAuth.js';
import doctorAuth from './routes/doctor/doctorAuth.js';
import { connectDB } from './config/connectDB.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

const port = process.env.PORT || 5000:

connectDb();

app.use(userAuth);
app.use(doctorAuth);

app.listen(port, () => {
  console.log(`server started`);
});
