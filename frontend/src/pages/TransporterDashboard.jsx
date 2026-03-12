import React, { useState, useEffect } from 'react';
import { logisticsAPI } from '../services/api';
import TruckIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/svg/ni-truck-location.svg';

const TransporterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await logisticsAPI.getOpenJobs();
            if (res.data.success) {
                setJobs(res.data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptJob = async (id) => {
        try {
            await logisticsAPI.acceptJob(id);
            alert('Job Accepted! 🚚');
            fetchJobs(); // Refresh list
        } catch (error) {
            console.error('Error accepting job:', error);
            alert('Failed to accept job');
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={TruckIcon} alt="Truck" style={{ width: '40px', height: '40px' }} />
                    <h1 style={{ color: '#1e293b', margin: 0 }}>Available Transport Jobs</h1>
                </div>

                {loading ? (
                    <p>Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p>No open jobs available right now.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {jobs.map(job => (
                            <div key={job.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                        {job.goods_type}
                                    </span>
                                    <span style={{ fontWeight: 'bold', color: '#16a34a' }}>₹{job.price_offer}</span>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                                        <strong>From:</strong> {job.pickup_location}
                                    </p>
                                    <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                                        <strong>To:</strong> {job.dropoff_location}
                                    </p>
                                    <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                                        <strong>Quantity:</strong> {job.quantity}
                                    </p>
                                    <p style={{ margin: '0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                                        <strong>Required:</strong> {job.vehicle_type_needed}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAcceptJob(job.id)}
                                    style={{ width: '100%', padding: '0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                                >
                                    Accept Job
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransporterDashboard;
