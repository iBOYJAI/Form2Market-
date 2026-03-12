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

        // 1. Create site_banners table
        const createBannersTable = `
            CREATE TABLE IF NOT EXISTS \`site_banners\` (
                \`id\` INT(11) NOT NULL AUTO_INCREMENT,
                \`title\` VARCHAR(255) NOT NULL,
                \`subtitle\` VARCHAR(255),
                \`image_path\` VARCHAR(255) NOT NULL,
                \`link_url\` VARCHAR(255),
                \`display_order\` INT(11) DEFAULT 0,
                \`is_active\` TINYINT(1) DEFAULT 1,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createBannersTable);
        console.log('✅ Checked/Created site_banners table');

        // 2. Create site_announcements table
        const createAnnouncementsTable = `
            CREATE TABLE IF NOT EXISTS \`site_announcements\` (
                \`id\` INT(11) NOT NULL AUTO_INCREMENT,
                \`title\` VARCHAR(255) NOT NULL,
                \`content\` TEXT NOT NULL,
                \`type\` ENUM('info', 'success', 'warning', 'danger') DEFAULT 'info',
                \`show_on_homepage\` TINYINT(1) DEFAULT 1,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createAnnouncementsTable);
        console.log('✅ Checked/Created site_announcements table');

    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

updateSchema();
