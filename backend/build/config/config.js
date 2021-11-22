'use strict';
require('dotenv').config();
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD } = process.env;
module.exports = {
  development: {
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: 'cmpg323prac2',
    host: DATABASE_HOST,
    port: 5432,
    dialect: 'postgres',
  },
};
