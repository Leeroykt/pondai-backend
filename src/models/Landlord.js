const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Landlord = sequelize.define('Landlord', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  phone:     { type: DataTypes.STRING(20),  allowNull: false },
  email:     { type: DataTypes.STRING(100), allowNull: false, unique: true },
  address:   { type: DataTypes.STRING(200) },
}, { tableName: 'landlords', timestamps: true });

module.exports = Landlord;