import express from 'express';
import { Query } from '../models/Query.js';
import axios from 'axios';
import { emailQueue } from '../queues/emailQueue.js';

const router = express.Router();

router.post(`/api/query`, async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const abstractAPI = process.env.ABSTRACT_API_KEY;

        const isValid = await axios.get(`https://emailreputation.abstractapi.com/v1/?api_key=${abstractAPI}&email=${email}`);

        const {
            is_format_valid,
            is_smtp_valid,
            is_mx_valid,
        } = isValid.data.email_deliverability;

        if (!is_format_valid || !is_mx_valid || !is_smtp_valid) {
            return res.status(401).json({
                success: false,
                message: "Email not valid",
            });
        }

        const newQuery = new Query({
            name, email, message
        });

        await newQuery.save();
        await emailQueue.add('query-message', {
            name, email
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        return res.status(201).json({
            success: true,
            message: `Query submitted`
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Something went wrong`
        });
    }
});

export default router;