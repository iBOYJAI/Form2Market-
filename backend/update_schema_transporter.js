const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market'
};

async function addTransporterRole() {
    console.log('🚚 Adding Transporter Role...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to DB');

        // 1. Alter Table to add 'transporter' to ENUM
        // Note: Doing this safely usually requires knowing the exact current definition. 
        // We will replace the column definition to include the new role.
        try {
            await connection.query(`
                ALTER TABLE users 
                MODIFY COLUMN role ENUM('farmer', 'buyer', 'admin', 'transporter') NOT NULL
            `);
            console.log('✅ Updated users table schema (role enum)');
        } catch (e) {
            console.log('⚠️  Schema update might have failed or already exists:', e.message);
        }

        // 2. Check if test transporter exists
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['transporter@farm.com']);

        if (rows.length === 0) {
            const password = 'password123';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await connection.query(
                `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`,
                ['Tom Transporter', 'transporter@farm.com', hashedPassword, 'transporter', 'active']
            );
            console.log('✅ Seeded test transporter: transporter@farm.com / password123');
        } else {
            console.log('ℹ️  Test transporter already exists');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addTransporterRole();
