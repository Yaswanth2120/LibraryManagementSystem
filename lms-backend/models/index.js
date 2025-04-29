// models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { DB_CONFIG } from '../config/db.config.js';
import UserModel from './user.js';
import BookModel from './book.js';
import BorrowRequestModel from './borrowrequest.js';

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
const db = {
  Sequelize,
  sequelize,
  User: UserModel(sequelize, Sequelize.DataTypes),
  Book: BookModel(sequelize, Sequelize.DataTypes),
  BorrowRequest: BorrowRequestModel(sequelize, Sequelize.DataTypes),
};

// Set up associations
Object.values(db).forEach(model => {
  if (model?.associate) {
    model.associate(db);
  }
});

export default db;
