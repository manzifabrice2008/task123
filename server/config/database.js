const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'SRMS';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const initPool = mysql.createPool({ ...poolConfig, database: DB_NAME });

const createDatabaseIfNotExists = async () => {
  const tempConn = await mysql.createConnection(poolConfig);
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await tempConn.end();
};

module.exports = { initPool, createDatabaseIfNotExists, DB_NAME };
