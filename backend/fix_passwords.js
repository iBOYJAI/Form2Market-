const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market'
};

async function fixPasswords() {
    console.log('🔧 Fixing passwords...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to DB');

        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log(`🔐 Generated hash for '${password}': ${hashedPassword}`);

        // Update all users to have this password
        const [result] = await connection.query(
            'UPDATE users SET password = ?',
            [hashedPassword]
        );

        console.log(`✅ Updated ${result.changedRows} users with the new password.`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixPasswords();
