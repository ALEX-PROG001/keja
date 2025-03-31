import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return next(errorHandler(401, 'No token found'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username  // Make sure username is included in the token
    };
    console.log('Decoded token:', decoded);  // Debug log
    next();
  } catch (error) {
    console.error('Token verification error:', error);  // Debug log
    return next(errorHandler(401, 'Invalid token'));
  }
};