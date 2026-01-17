import express from 'express';
import { Doctor } from '../../models/Doctor.js';

const router = express.Router();

router.get('/api/user/doctor-list'), async (req, res) => {
   try{
     const found = await Doctor.find();

     return res.status(200).json({
       success: true,
       message: 'Fetched all doctors',
       found
     });
   }
   catch(err){
     console.log(err);
     return res.status(500).json({
       success: false,
       message: 'Something went wrong',
     });
   }
});

router.get('/api/user/doctor'), async (req, res) => {

  const id = req.query.id;
  
  try{
     const found = await Doctor.findById(id);

     if(!found){
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
   catch(err){
     console.log(err);
     return res.status(500).json({
       success: false,
       message: 'Something went wrong',
     });
   }
});

