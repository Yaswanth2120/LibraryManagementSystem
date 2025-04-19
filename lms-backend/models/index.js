// models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { DB_CONFIG } from '../config/db.config.js';
import UserModel from './user.js'; // import more models as you add them

dotenv.config();

const sequelize = new Sequelize(
  DB_CONFIG.DB,
  DB_CONFIG.USER,
  DB_CONFIG.PASSWORD,
  {
    host: DB_CONFIG.HOST,
    dialect: DB_CONFIG.dialect,
    port: DB_CONFIG.PORT,
    logging: false,
  }
);

// Initialize models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, Sequelize.DataTypes); // initialize User

// Future model associations can go here
// ex: db.Book.belongsTo(db.User);

export default db;
