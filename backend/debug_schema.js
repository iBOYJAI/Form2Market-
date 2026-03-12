const db = require('./db');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM users');
        console.log('Users Columns:', JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
