import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';
import { Doctor } from '../../models/Doctor.js';
import { Hospital } from '../../models/Hospital.js';
import { arcjetProtect } from '../../middleware/arcjetProtect.js';

const router = express.Router();

// doctor login
router.post('/api/doctor/login', arcjetProtect, async (req, res) => {
  const { email, password } = req.body;

    try{
        const present = await Doctor.findOne({email});

        if(!present){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if(!present.verified){
          return res.status(403).json({
                success: false,
                message: "You are not verified by your hospital",
            });
        }

        const isMatch = await bcrypt.compare(password, present.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({email: email, name: present.name, userId: present._id, role: 'DOCTOR' }, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 840000,
          secure: false,
          sameSite: 'strict'
        });
      
        return res.status(200).json({
            success: true,
            message: "Login seccessfull",
            token
        });

    } 
    catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

// doctor register
router.post('/api/doctor/register', arcjetProtect, async (req, res) => {
  const { name, email, password, hospital, speciality, gender } = req.body;
 
    try{
        const present1 = await User.findOne({email});
        const present2 = await Doctor.findOne({email});
        const present3 = await Hospital.findOne({email});
        
        if(present1 || present2 || present3){
            return res.status(400).json({
                success: false,
                message: "Email linked with another user",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new Doctor({
            name, 
            email, 
            password: hashedPassword,
            hospital, 
            speciality, 
            gender
        });

        await newDoctor.save();

        return res.status(200).json({
            success: true,
            message: "Doctor registered successfull",
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

export default router:
