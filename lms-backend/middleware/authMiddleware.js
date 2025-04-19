// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.js';

dotenv.config();
const User = db.User;

// 🔐 Middleware: Protect (only allows logged-in users)
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request
      req.user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email', 'role'],
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // user is authenticated
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'No token, not authorized' });
  }
};

// 🔒 Middleware: Authorize roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
