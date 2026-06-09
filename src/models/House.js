const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const House = sequelize.define('House', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  landlord_id:   { type: DataTypes.INTEGER, allowNull: false },
  address:       { type: DataTypes.STRING(200), allowNull: false },
  total_rooms:   { type: DataTypes.INTEGER, allowNull: false },
  rent_per_room: { type: DataTypes.FLOAT, allowNull: false },
  status:        { type: DataTypes.ENUM('available','full'), defaultValue: 'available' },
  latitude:      { type: DataTypes.FLOAT },
  longitude:     { type: DataTypes.FLOAT },
}, { tableName: 'houses', timestamps: true });

module.exports = House;