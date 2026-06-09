const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name:    { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash:{ type: DataTypes.STRING(256), allowNull: false },
}, { tableName: 'users', timestamps: true });

User.prototype.setPassword = async function(password) {
  this.password_hash = await bcrypt.hash(password, 12);
};

User.prototype.checkPassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;