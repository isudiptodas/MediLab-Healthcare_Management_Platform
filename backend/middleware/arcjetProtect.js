import { arcjet } from '../config/arcjetSecurity.js';

export const arcjetProtect = async (req, res, next) => {
  
  const decision = await arcjet.protect(req, { requested: 5 }); 

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
        success: false,
        message: 'Too many request'
       });
     }
      else if (decision.reason.isBot()) {
        return res.status(403).json({
        success: false,
        message: 'Bot detected'
      });
     }
      else {
        return res.status(403).json({
        success: false,
        message: 'Forbidden'
      });
    }
  }

  return next();
}
