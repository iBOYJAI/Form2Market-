/**
 * Public Settings Routes
 * Accessible to all users
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// Get public settings (Site Name, Support Email, etc.)
router.get('/public', async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM site_settings');

        const publicSettings = {};

        // Filter sensitive settings if any (currently all safe)
        settings.forEach(setting => {
            let value = setting.setting_value;

            if (setting.setting_type === 'number') {
                value = parseFloat(value);
            } else if (setting.setting_type === 'boolean') {
                value = value === 'true';
            } else if (setting.setting_type === 'json') {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.error('Failed to parse JSON setting:', setting.setting_key);
                }
            }

            publicSettings[setting.setting_key] = value;
        });

        res.json({ success: true, settings: publicSettings });
    } catch (error) {
        console.error('Get public settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
});

module.exports = router;
