const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id:  { type: DataTypes.INTEGER, allowNull: false },
  house_id:    { type: DataTypes.INTEGER, allowNull: false },
  room_number: { type: DataTypes.STRING(20) },
  start_date:  { type: DataTypes.DATEONLY, allowNull: false },
  end_date:    { type: DataTypes.DATEONLY },
  status:      { type: DataTypes.ENUM('active','ended'), defaultValue: 'active' },
}, { tableName: 'assignments', timestamps: true });

module.exports = Assignment;