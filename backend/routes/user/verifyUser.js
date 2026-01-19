import jwt from 'jsonwebtoken';
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { User } from '../../models/User.js';

const router = express.Router();

// verify for valid user on every page
router.get('/api/user/verify', authenticate, (req, res) = > {
  return res.status(200).json({
    success: true,
    message: 'user verified'
  });
});

// retrieves current logged in users data
router.get('/api/user/get-data', authenticate, (req, res) = > {

  const userData = req.userData;

  try{
    const id = userData.id;

    const found = await User.findById(id);

    return res.status(200).json({
      success: true,
      message: 'user data fetched',
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
