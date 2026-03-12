/**
 * Database Connection Configuration
 * MySQL connection pool for Form2Market application
 */

const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'form2market',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Make sure XAMPP MySQL is running!');
    process.exit(1);
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

module.exports = promisePool;
