const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(`postgres://postgres:${process.env.POSTGRESQL_PASSWORD}@localhost:5432/postgres`);

module.exports = sequelize;
