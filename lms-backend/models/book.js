// models/book.js

export default (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  });

  return Book;
};
