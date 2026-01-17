import jwt from 'jsonwebtoken';
import express from 'express';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if(!token){
    return res.status(403).json({
      success: false,
      message: 'token missing'
    });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    next();
  }
  catch(err){
    console.log(err);
    return res.status(505).json({
      success: false,
      message: 'Error validating token'
    });
  }
}

