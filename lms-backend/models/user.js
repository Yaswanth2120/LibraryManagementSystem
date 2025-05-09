// models/user.js
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student',
    },
  });

  User.associate = (models) => {
    User.hasMany(models.BorrowRequest, {
      foreignKey: 'userId',
      as: 'BorrowRequests',
    });
  };

  return User;
};
