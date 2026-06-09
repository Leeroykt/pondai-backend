const sequelize  = require('../config/database');
const User       = require('./User');
const Landlord   = require('./Landlord');
const House      = require('./House');
const Student    = require('./Student');
const Assignment = require('./Assignment');
const Payment    = require('./Payment');

// Associations
Landlord.hasMany(House,       { foreignKey: 'landlord_id', as: 'houses' });
House.belongsTo(Landlord,     { foreignKey: 'landlord_id', as: 'landlord' });

Student.hasMany(Assignment,   { foreignKey: 'student_id',  as: 'assignments' });
Assignment.belongsTo(Student, { foreignKey: 'student_id',  as: 'student' });

House.hasMany(Assignment,     { foreignKey: 'house_id',    as: 'assignments' });
Assignment.belongsTo(House,   { foreignKey: 'house_id',    as: 'house' });

Assignment.hasMany(Payment,   { foreignKey: 'assignment_id', as: 'payments' });
Payment.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

module.exports = { sequelize, User, Landlord, House, Student, Assignment, Payment };