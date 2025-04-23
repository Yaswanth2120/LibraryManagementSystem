// models/borrowrequest.js
export default (sequelize, DataTypes) => {
  const BorrowRequest = sequelize.define('BorrowRequest', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  });

  return BorrowRequest;
};
