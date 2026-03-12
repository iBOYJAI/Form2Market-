const db = require('./db');

async function checkAnnouncements() {
    try {
        const [rows] = await db.query('SELECT * FROM site_announcements');
        console.log('Announcements:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAnnouncements();
