import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userAuth from './routes/user/userAuth.js';
import verifyUser from './routes/user/verifyUser.js';
import appointmentBook from './routes/user/bookAppointment.js';

import doctorAuth from './routes/doctor/doctorAuth.js';
import doctorData from './routes/doctor/doctorData.js';
import verifyDoctor from './routes/doctor/verifyDoctor.js';

import hospitalAuth from './routes/hospital/hospitalAuth.js';
import verifyHospital from './routes/hospital/verifyHospital.js';
import manageDoctor from './routes/hospital/manageDoctor.js';

import query from './routes/queryMessage.js';
import passwordRecovery from './routes/passwordRecovery.js';

import { emailQueue, emailWorker } from './queues/emailQueue.js';
import { connectDB } from './config/connectDB.js';

const app = express();

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
app.use(appointmentBook);

app.use(doctorAuth);
app.use(doctorData);
app.use(verifyDoctor);

app.use(hospitalAuth);
app.use(verifyHospital);
app.use(manageDoctor);

app.use(passwordRecovery);
app.use(query);

app.listen(port, () => {
  console.log(`server started`);
});
