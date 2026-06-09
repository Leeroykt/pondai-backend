const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assignment_id:  { type: DataTypes.INTEGER, allowNull: false },
  amount:         { type: DataTypes.FLOAT,   allowNull: false },
  payment_date:   { type: DataTypes.DATEONLY,allowNull: false },
  month_paid_for: { type: DataTypes.STRING(20), allowNull: false },
  method:         { type: DataTypes.ENUM('cash','ecocash','bank'), defaultValue: 'cash' },
  notes:          { type: DataTypes.TEXT },
}, { tableName: 'payments', timestamps: true });

module.exports = Payment;