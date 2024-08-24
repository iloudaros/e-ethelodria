const sequelize = require('../config/config');
const User = require('./user');

const db = {
  sequelize,
  User,
};

module.exports = db;