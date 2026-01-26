import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userAuth from './routes/user/userAuth.js';
import verifyUser from './routes/user/verifyUser.js';

import doctorAuth from './routes/doctor/doctorAuth.js';
import doctorData from './routes/doctor/doctorData.js';
import verifyDoctor from './routes/doctor/verifyDoctor.js';

import hospitalAuth from './routes/hospital/hospitalAuth.js';
import verifyHospital from './routes/hospital/verifyHospital.js';

import { connectDB } from './config/connectDB.js';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

const port = process.env.PORT || 5000;

connectDB();

app.use(userAuth);
app.use(verifyUser);

app.use(doctorAuth);
app.use(doctorData);
app.use(verifyDoctor);

app.use(hospitalAuth);
app.use(verifyHospital);

app.listen(port, () => {
  console.log(`server started`);
});
