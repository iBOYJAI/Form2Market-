import React, { useState, useEffect } from 'react';
import { logisticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyDeliveries = () => {
    const { user } = useAuth(); // Need to get current user to check role
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await logisticsAPI.getMyJobs();
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container">
                <h1 style={{ color: '#1e293b', marginBottom: '2rem' }}>
                    {user?.role === 'transporter' ? 'My Deliveries 📦' : 'My Transport Requests 🚛'}
                </h1>

                {loading ? (
                    <p>Loading...</p>
                ) : jobs.length === 0 ? (
                    <p>No jobs found.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {jobs.map(job => (
                            <div key={job.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>
                                        {job.pickup_location} ➝ {job.dropoff_location}
                                    </h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                                        {job.goods_type} ({job.quantity}) • ₹{job.price_offer}
                                    </p>
                                    <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        {user?.role === 'transporter'
                                            ? `Requested by: ${job.requester_name}`
                                            : `Transporter: ${job.transporter_name || 'Pending Acceptance'}`
                                        }
                                    </p>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        background: job.status === 'completed' ? '#dcfce7' : (job.status === 'accepted' ? '#e0f2fe' : '#f1f5f9'),
                                        color: job.status === 'completed' ? '#16a34a' : (job.status === 'accepted' ? '#0284c7' : '#64748b'),
                                        textTransform: 'capitalize'
                                    }}>
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDeliveries;
