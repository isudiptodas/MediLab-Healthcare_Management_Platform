import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { Hospital } from '../../models/Hospital.js';

const router = express.Router();

// verify for valid hospital on every page
router.get('/api/hospital/verify', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'hospital verified'
  });
});

// retrieves current logged in hospital data
router.get('/api/hospital/get-data', authenticate, async (req, res) => {

  const hospitalData = req.userData;

  try{
    const id = hospitalData.id;

    const found = await Hospital.findById(id);

    return res.status(200).json({
      success: true,
      message: 'hospital data fetched',
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
