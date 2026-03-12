const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market'
};

async function updateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔌 Connected to database...');

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contact_messages' AND COLUMN_NAME = 'is_archived'
        `, [dbConfig.database]);

        if (columns.length === 0) {
            console.log('🚧 Adding is_archived column...');
            await connection.query(`
                ALTER TABLE contact_messages 
                ADD COLUMN is_archived BOOLEAN DEFAULT FALSE
            `);
            console.log('✅ is_archived column added successfully');
        } else {
            console.log('ℹ️ is_archived column already exists');
        }

    } catch (error) {
        console.error('❌ Schema Update Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
