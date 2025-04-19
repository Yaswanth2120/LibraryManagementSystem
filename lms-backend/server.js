// server.js
import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { DB_CONFIG } from './config/db.config.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sequelize DB connection
const sequelize = new Sequelize(
  DB_CONFIG.DB,
  DB_CONFIG.USER,
  DB_CONFIG.PASSWORD,
  {
    host: DB_CONFIG.HOST,
    dialect: DB_CONFIG.dialect,
    port: DB_CONFIG.PORT
  }
);

// Test DB connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL DB connected successfully.');

    // Start server after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('📚 LibriSys API is running...');
});
