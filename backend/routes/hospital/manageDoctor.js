import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { Doctor } from '../../models/Doctor.js';
import { emailQueue } from '../../queues/emailQueue.js';

const router = express.Router();

// approve any doctor
router.put('/api/hospital/approve', authenticate, async (req, res) => {
    const { id } = req.body;

    try {
        const found = await Doctor.findById(id);

        found.verified = true;
        await found.save();

        emailQueue.add('doctor-approved', {
            name: found.name,
            email: found.email,
            hospital: found.hospital
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Doctor approved'
        });
    } catch (err) {
        console.log("Error -> ", err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
});

// reject any doctor
router.put('/api/hospital/reject', authenticate, async (req, res) => {

    const { id } = req.body;

    try {
        const found = await Doctor.findByIdAndDelete(id);

        emailQueue.add('doctor-rejected', {
            name: found.name,
            email: found.email,
            hospital: found.hospital
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Doctor rejected'
        });

    } catch (err) {
        console.log("Error -> ", err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
});

export default router;
