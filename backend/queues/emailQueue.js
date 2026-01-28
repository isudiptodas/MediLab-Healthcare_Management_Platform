import { Queue, Worker } from 'bullmq';
import { redisConnect } from '../config/redisConnect.js';
import { resend } from '../config/resend.js';
import { emailTemplate } from '../data/welcomeEmailTemplate.js';

export const emailQueue = new Queue('email', {
    connection: redisConnect,
});

export const emailWorker = new Worker('email', async job => {

    // notify users on account creation
    if (job.name === 'welcome-email') {
        try {
            const { email, name } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Account Creation Successfull',
                html: `<h1>MediLab</h1> \n <p>Welcome ${name}</p>\n ${emailTemplate}`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // notify a doctor on account reject
    if (job.name === 'doctor-rejected') {
        try {
            const { email, name, hospital } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Account Rejected',
                html: `<h1>MediLab</h1> \n <p>Sorry to inform you ${name}.\n Unfortunately your doctor profile 
                       for MediLab has been rejected by <b>${hospital}</b></p>`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // notify a doctor on account approve
    if (job.name === 'doctor-approved') {
        try {
            const { email, name, hospital } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Account Verified',
                html: `<h1>MediLab</h1> \n <p>Congratulations ${name}.\n Your doctor profile for MediLab has been approved by <b>${hospital}</b>.\n
                       You can now start receiving appointments.</p>`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // notify a user on account recovery
    if (job.name === 'account-recovery') {
        try {
            const { email, name } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Password Changed',
                html: `<h1>MediLab</h1>\n\n <p> Hello ${name}.\n We saw you changed your password recently. \n
                       If it's done by you then you can ignore this mail otherwise you can report a message to us 
                       and we will look on this matter as earliest as possible.</p>`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // notify a user on account recovery
    if (job.name === 'appointment-booked') {
        try {
            const { name, email, doctorName, date, timeSlot } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Appointment Scheduled',
                html: `<h1>MediLab</h1> \n<p>Hello ${name} \n A new appointment was scheduled for
                      <b>${date}</b> on time between <b>${timeSlot}</b></p> \n\n <p>We hope you will have a seamless
                      appointment experience.</p>\n\n
                      <p><b>Doctor name : ${doctorName}</b></p> \n <p><b>Patient name : ${name}</b></p> \n
                      <p><b>Date : ${date}</b></p> \n <p><b>Time slot : ${timeSlot}</b></p>`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // notify a user on query message submit
    if (job.name === 'query-message') {
        try {
            const { name, email } = job.data;
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_EMAIL,
                to: [email],
                subject: 'Query Submitted',
                html: `<h1>MediLab</h1> \n  <p>Hello ${name},</p>\n <p>This mail is to let you know
                      that we got your query message and we will try to respond to your query as earliest
                      as possible.</p>\n\n <p>Thank you for having patience and trusting us.</p>`
            });

            if (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

}, { connection: redisConnect });

