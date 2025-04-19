import dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  PORT: process.env.DB_PORT,
  dialect: 'mysql'
};
