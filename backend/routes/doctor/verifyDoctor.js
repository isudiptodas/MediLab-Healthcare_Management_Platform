import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { Doctor } from '../../models/Doctor.js';

const router = express.Router();

// verify for valid doctor on every page
router.get('/api/doctor/verify', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'doctor verified'
  });
});

// retrieves current logged in doctors data
router.get('/api/doctor/get-data', authenticate, async (req, res) => {

  const doctorData = req.userData;

  try{
    const id = doctorData.id;

    const found = await Doctor.findById(id);

    return res.status(200).json({
      success: true,
      message: 'doctor data fetched',
      found
    });
  }
  catch(err){
     console.log("Error -> ", err);
     return res.status(500).json({
       success: false,
       message: 'Something went wrong'
     });
   }
});

export default router;
