/**
 * Logistics Controller
 * Handles transport jobs and transporter profiles
 */

const { body, validationResult } = require('express-validator');
const db = require('../db');
const { createNotification } = require('./notificationController');

/**
 * Create a new transport job
 * POST /api/logistics/jobs
 */
const createJob = async (req, res) => {
    try {
        const { pickup_location, dropoff_location, goods_type, quantity, vehicle_type_needed, price_offer, description } = req.body;

        const [result] = await db.query(
            `INSERT INTO transport_jobs 
             (requester_id, pickup_location, dropoff_location, goods_type, quantity, vehicle_type_needed, price_offer, description) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, pickup_location, dropoff_location, goods_type, quantity, vehicle_type_needed, price_offer, description]
        );

        res.status(201).json({
            success: true,
            message: 'Transport job posted successfully',
            jobId: result.insertId
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get open jobs for transporters
 * GET /api/logistics/jobs/open
 */
const getOpenJobs = async (req, res) => {
    try {
        const [jobs] = await db.query(
            `SELECT j.*, u.name as requester_name, u.email as requester_email 
             FROM transport_jobs j
             JOIN users u ON j.requester_id = u.id
             WHERE j.status = 'open'
             ORDER BY j.created_at DESC`
        );

        res.json({ success: true, jobs });
    } catch (error) {
        console.error('Get open jobs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Accept a job (Transporter only)
 * PUT /api/logistics/jobs/:id/accept
 */
const acceptJob = async (req, res) => {
    try {
        // Check if job is still open
        const [jobs] = await db.query('SELECT * FROM transport_jobs WHERE id = ?', [req.params.id]);
        if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
        if (jobs[0].status !== 'open') return res.status(400).json({ success: false, message: 'Job already accepted' });

        // Update status
        await db.query(
            'UPDATE transport_jobs SET status = ?, transporter_id = ? WHERE id = ?',
            ['accepted', req.user.id, req.params.id]
        );

        // Notify requester
        await createNotification(
            jobs[0].requester_id,
            'job_update',
            'Transport Job Accepted',
            `Your transport request has been accepted by ${req.user.name}.`,
            '/my-deliveries'
        );

        res.json({ success: true, message: 'Job accepted' });
    } catch (error) {
        console.error('Accept job error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get jobs related to the user (either requester or transporter)
 * GET /api/logistics/my-jobs
 */
const getMyJobs = async (req, res) => {
    try {
        let query, params;
        if (req.user.role === 'transporter') {
            query = `SELECT j.*, u.name as requester_name 
                     FROM transport_jobs j
                     JOIN users u ON j.requester_id = u.id
                     WHERE j.transporter_id = ? 
                     ORDER BY j.created_at DESC`;
            params = [req.user.id];
        } else {
            query = `SELECT j.*, u.name as transporter_name 
                     FROM transport_jobs j
                     LEFT JOIN users u ON j.transporter_id = u.id
                     WHERE j.requester_id = ? 
                     ORDER BY j.created_at DESC`;
            params = [req.user.id];
        }

        const [jobs] = await db.query(query, params);
        res.json({ success: true, jobs });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createJob,
    getOpenJobs,
    acceptJob,
    getMyJobs
};
