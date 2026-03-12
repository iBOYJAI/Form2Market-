const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market',
    multipleStatements: true
};

async function updateSchema() {
    console.log('🔌 Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // Create site_settings table
        console.log('🚧 Creating site_settings table...');
        const createSettingsTable = `
            CREATE TABLE IF NOT EXISTS \`site_settings\` (
                \`setting_key\` VARCHAR(50) NOT NULL,
                \`setting_value\` TEXT,
                \`setting_type\` VARCHAR(20) DEFAULT 'string',
                PRIMARY KEY (\`setting_key\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createSettingsTable);
        console.log('✅ site_settings table created successfully');

        // Seed default settings if empty
        const [rows] = await connection.query('SELECT count(*) as count FROM site_settings');
        if (rows[0].count === 0) {
            console.log('🌱 Seeding default settings...');
            const defaultSettings = [
                ['site_name', 'Form2Market', 'string'],
                ['platform_fee', '5', 'number'],
                ['support_email', 'support@form2market.com', 'string'],
                ['enable_registration', 'true', 'boolean'],
                ['admin_notifications', 'true', 'boolean'],
                ['maintenance_mode', 'false', 'boolean']
            ];

            for (const [key, value, type] of defaultSettings) {
                await connection.query(
                    'INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?)',
                    [key, value, type]
                );
            }
            console.log('✅ Default settings seeded');
        }

    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
