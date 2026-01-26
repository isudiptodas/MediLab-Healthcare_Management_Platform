import express from 'express';
import { Doctor } from '../../models/Doctor.js';

const router = express.Router();

// fetch all available doctors list
router.get('/api/all-doctors', async (req, res) => {
  try {
    const found = await Doctor.find({ verified: true });

    return res.status(200).json({
      success: true,
      message: 'Fetched all doctors',
      found
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

// fetch a single doctor with id
router.get('/api/doctor-id', async (req, res) => {

  const id = req.query.id;

  try {
    const found = await Doctor.findById(id);

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor found',
      found
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});

// fetch doctors by name
router.get('/api/doctor-name', async (req, res) => {

  const name = req.query.name

  try {
    const found = await Doctor.find({ name }).collation({ locale: "en", strength: 2 });

    if (found.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctors not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor found',
      found
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
});


export default router;
