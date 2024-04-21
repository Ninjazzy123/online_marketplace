require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
 user: 'postgres',
 host: 'localhost',
 database: 'postgres',
 password: process.env.POSTGRESQL_PASSWORD,
 port: 5432,
});

pool.connect((err) => {
 if (err) {
    console.error('Error connecting to PostgreSQL', err);
 } else {
    console.log('Connected to PostgreSQL');
 }
});

module.exports = pool;