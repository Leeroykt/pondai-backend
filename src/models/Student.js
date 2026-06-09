const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name:   { type: DataTypes.STRING(100), allowNull: false },
  phone:       { type: DataTypes.STRING(20),  allowNull: false },
  email:       { type: DataTypes.STRING(100), allowNull: false, unique: true },
  university:  { type: DataTypes.STRING(150) },
  course:      { type: DataTypes.STRING(150) },
  national_id: { type: DataTypes.STRING(50), unique: true },
}, { tableName: 'students', timestamps: true });

module.exports = Student;