/**
 * Contact Controller
 * Handles contact form submissions and retrieving messages for admin
 */
const db = require('../db');

// Submit a new contact message
exports.submitContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
        await db.query(query, [name, email, subject, message]);

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all messages (Admin only) - defaults to inbox (not archived)
exports.getAllMessages = async (req, res) => {
    try {
        const { archived } = req.query;
        // If archived=true, show archived. Otherwise show inbox (is_archived=0)
        const isArchived = archived === 'true' ? 1 : 0;

        const query = 'SELECT * FROM contact_messages WHERE is_archived = ? ORDER BY created_at DESC';
        const [messages] = await db.query(query, [isArchived]);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark message as read
/* exports.markAsRead = async (req, res) => { ... } */

// Archive message (Admin only)
exports.archiveMessage = async (req, res) => {
    try {
        const query = 'UPDATE contact_messages SET is_archived = 1 WHERE id = ?';
        await db.query(query, [req.params.id]);

        res.status(200).json({ message: 'Message archived successfully' });
    } catch (error) {
        console.error('Error archiving message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete message completely (Optional, for archived messages)
exports.deleteMessage = async (req, res) => {
    try {
        const query = 'DELETE FROM contact_messages WHERE id = ?';
        await db.query(query, [req.params.id]);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Restore message from archive (Admin only)
exports.restoreMessage = async (req, res) => {
    try {
        const query = 'UPDATE contact_messages SET is_archived = 0 WHERE id = ?';
        await db.query(query, [req.params.id]);

        res.status(200).json({ message: 'Message restored successfully' });
    } catch (error) {
        console.error('Error restoring message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
