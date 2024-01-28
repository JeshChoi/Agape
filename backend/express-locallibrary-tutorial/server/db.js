const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
  user: process.env.GCP_DB_USER,
  password: process.env.GCP_DB_PASSWORD,
  host: process.env.GCP_DB_HOST,
  port: process.env.GCP_DB_PORT,
  database: process.env.GCP_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { db, pgp };
