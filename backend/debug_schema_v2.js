const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market'
};

async function checkSchema() {
    console.log('🔌 Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        const tables = ['site_settings', 'site_banners', 'site_announcements'];

        for (const table of tables) {
            console.log(`\n🔍 Checking table: ${table}`);
            try {
                const [rows] = await connection.query(`DESCRIBE ${table}`);
                console.log(JSON.stringify(rows, null, 2));
            } catch (e) {
                console.error(`❌ Table ${table} does NOT exist or error:`, e.message);
            }
        }

    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        if (connection) await connection.end();
        console.log('🔌 Connection closed.');
    }
}

checkSchema();
