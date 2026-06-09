const { initPool, createDatabaseIfNotExists, DB_NAME } = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const stripComments = (sql) => {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--') && line.trim().length > 0)
    .join('\n');
};

const splitStatements = (sql) => {
  const cleaned = stripComments(sql);
  return cleaned
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .filter((s) => !s.toUpperCase().startsWith('CREATE DATABASE'))
    .filter((s) => !s.toUpperCase().startsWith('USE '));
};

const initializeDatabase = async () => {
  try {
    await createDatabaseIfNotExists();

    const schema = fs.readFileSync(
      path.join(__dirname, '..', 'schema.sql'),
      'utf8'
    );

    const statements = splitStatements(schema);

    const conn = await initPool.getConnection();
    try {
      for (const statement of statements) {
        await conn.query(statement);
      }
    } finally {
      conn.release();
    }
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

const seedDatabase = async () => {
  try {
    const conn = await initPool.getConnection();
    try {
      const [rows] = await conn.query('SELECT COUNT(*) as count FROM Users');
      if (rows[0].count === 0) {
        const seed = fs.readFileSync(
          path.join(__dirname, '..', 'seed.sql'),
          'utf8'
        );

        const statements = splitStatements(seed);

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await conn.query(
          'INSERT INTO Users (UserName, Password) VALUES (?, ?)',
          ['admin', hashedPassword]
        );

        for (const statement of statements) {
          await conn.query(statement);
        }
        console.log('Database seeded successfully');
      } else {
        console.log('Database already contains data, skipping seed');
      }
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = { initializeDatabase, seedDatabase };
