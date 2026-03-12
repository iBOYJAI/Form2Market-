const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'form2market',
    multipleStatements: true
};

async function setupDatabase() {
    console.log('🔌 Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // 1. Create contact_messages table
        const createContactTable = `
            CREATE TABLE IF NOT EXISTS \`contact_messages\` (
                \`id\` INT(11) NOT NULL AUTO_INCREMENT,
                \`name\` VARCHAR(100) NOT NULL,
                \`email\` VARCHAR(191) NOT NULL,
                \`subject\` VARCHAR(150) NOT NULL,
                \`message\` TEXT NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`read_status\` TINYINT(1) DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createContactTable);
        console.log('✅ Checked/Created contact_messages table');

        // 3. Create notifications table
        const createNotificationsTable = `
            CREATE TABLE IF NOT EXISTS \`notifications\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`user_id\` INT NOT NULL,
                \`type\` VARCHAR(50) NOT NULL,
                \`title\` VARCHAR(100) NOT NULL,
                \`message\` TEXT NOT NULL,
                \`link\` VARCHAR(255),
                \`is_read\` BOOLEAN DEFAULT FALSE,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createNotificationsTable);
        console.log('✅ Checked/Created notifications table');

        // 4. Create inquiry_messages table (for chat)
        // Ensure inquiries table exists first (it should be created by other scripts, but adding check here if needed)
        // Assuming 'inquiries' table exists as per inquiryController
        const createInquiryMessagesTable = `
            CREATE TABLE IF NOT EXISTS \`inquiry_messages\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`inquiry_id\` INT NOT NULL,
                \`sender_id\` INT NOT NULL,
                \`message\` TEXT NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (\`inquiry_id\`) REFERENCES \`inquiries\`(\`id\`) ON DELETE CASCADE,
                FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createInquiryMessagesTable);
        console.log('✅ Checked/Created inquiry_messages table');

        // 5. Create transport_jobs table
        const createTransportJobsTable = `
            CREATE TABLE IF NOT EXISTS \`transport_jobs\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`requester_id\` INT NOT NULL,
                \`pickup_location\` VARCHAR(255) NOT NULL,
                \`dropoff_location\` VARCHAR(255) NOT NULL,
                \`goods_type\` VARCHAR(100),
                \`quantity\` VARCHAR(50),
                \`vehicle_type_needed\` VARCHAR(50),
                \`price_offer\` DECIMAL(10, 2),
                \`description\` TEXT,
                \`status\` ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
                \`transporter_id\` INT,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (\`requester_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
                FOREIGN KEY (\`transporter_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createTransportJobsTable);
        console.log('✅ Checked/Created transport_jobs table');

        // 6. Create transporter_profiles table
        const createTransporterProfilesTable = `
            CREATE TABLE IF NOT EXISTS \`transporter_profiles\` (
                \`id\` INT AUTO_INCREMENT PRIMARY KEY,
                \`user_id\` INT NOT NULL,
                \`vehicle_type\` VARCHAR(50),
                \`vehicle_number\` VARCHAR(20),
                \`is_available\` BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await connection.query(createTransporterProfilesTable);
        console.log('✅ Checked/Created transporter_profiles table');

        // 2. Check Users
        const [users] = await connection.query('SELECT count(*) as count FROM users');
        console.log(`📊 Current user count: ${users[0].count}`);

        if (users[0].count === 0) {
            console.log('🌱 Seeding Users...');
            const seedUsers = `
                INSERT INTO \`users\` (\`name\`,\`email\`,\`password\`,\`role\`,\`status\`) VALUES 
                ('Admin User','admin@farm.com','$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe','admin','active'),
                ('John Farmer','farmer@farm.com','$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe','farmer','active'),
                ('Jane Buyer','buyer@farm.com','$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe','buyer','active');
            `;
            await connection.query(seedUsers);
            console.log('✅ Users seeded successfully');
        } else {
            console.log('ℹ️ Users already exist. Skipping seed.');
        }

    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
