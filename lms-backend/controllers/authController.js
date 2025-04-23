import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import generateToken from '../utils/generateToken.js';

const User = db.User;

//Register new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      let role = 'student';
      if (email.endsWith('@librarian.com')) role = 'librarian';
      else if (email.endsWith('@admin.com')) role = 'admin';
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });
  
      const token = generateToken(user.id);
      res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  };
  

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user.id);
    res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};