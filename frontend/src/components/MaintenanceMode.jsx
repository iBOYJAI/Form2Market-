import React from 'react';

const MaintenanceMode = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                maxWidth: '600px',
                width: '90%'
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    display: 'inline-block',
                    padding: '1.5rem',
                    borderRadius: '50%',
                    background: '#fff1f2',
                    color: '#e11d48'
                }}>
                    🛠️
                </div>

                <h1 style={{
                    color: '#0f172a',
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    letterSpacing: '-0.025em'
                }}>
                    Under Maintenance
                </h1>

                <p style={{
                    color: '#475569',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    We're currently upgrading our platform to serve you better.
                    The site will be back online shortly. Thank you for your patience!
                </p>

                <div style={{
                    padding: '1rem',
                    background: '#f1f5f9',
                    borderRadius: '12px',
                    display: 'inline-block',
                    color: '#64748b',
                    fontSize: '0.9rem'
                }}>
                    Administrator? <a href="/login" style={{ color: '#0f172a', fontWeight: 'bold', textDecoration: 'none' }}>Login here</a>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceMode;
