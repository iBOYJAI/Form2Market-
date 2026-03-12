/**
 * Farmer Dashboard
 * High-level overview with quick stats and links
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, inquiryAPI } from '../services/api';

// Icons
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const MessageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const TrendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

const FarmerDashboard = () => {
    const [stats, setStats] = useState({
        productsCount: 0,
        totalStock: 0,
        inquiriesCount: 0,
        recentInquiries: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, inquiriesRes] = await Promise.all([
                productAPI.getFarmerProducts(),
                inquiryAPI.getFarmerInquiries()
            ]);

            const products = productsRes.data.products;
            const inquiries = inquiriesRes.data.inquiries;

            setStats({
                productsCount: products.length,
                totalStock: products.reduce((sum, p) => sum + p.quantity, 0),
                inquiriesCount: inquiries.length,
                recentInquiries: inquiries.slice(0, 3)
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                        Dashboard Overview
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Farmer!</p>
                </div>
                <Link to="/farmer/products/add" className="btn btn-primary" style={{ paddingLeft: '1.25rem', paddingRight: '1.5rem' }}>
                    <PlusIcon /> Add Product
                </Link>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <Link to="/farmer/products" className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1rem', background: 'rgba(98, 129, 65, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
                        <BoxIcon />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>{stats.productsCount}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Products</p>
                    </div>
                </Link>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1rem', background: 'rgba(217, 119, 6, 0.1)', borderRadius: '50%', color: 'var(--warning)' }}>
                        <TrendingIcon />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>{stats.totalStock}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Stock Units</p>
                    </div>
                </div>

                <Link to="/farmer/inquiries" className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--info)' }}>
                        <MessageIcon />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>{stats.inquiriesCount}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Inquiries</p>
                    </div>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Quick Actions */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Quick Navigation</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/farmer/products" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', transition: 'background 0.2s' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500' }}><BoxIcon /> My Products</span>
                            <ArrowRightIcon />
                        </Link>
                        <Link to="/farmer/inquiries" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)', transition: 'background 0.2s' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500' }}><MessageIcon /> Inquiries Inbox</span>
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'white' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Recent Inquiries</h2>

                    {stats.recentInquiries.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No recent inquiries.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.recentInquiries.map(inquiry => (
                                <div key={inquiry.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{inquiry.buyer_name}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                            {new Date(inquiry.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        Re: {inquiry.product_name}
                                    </p>
                                </div>
                            ))}
                            <Link to="/farmer/inquiries" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500', marginTop: '0.5rem', display: 'inline-block' }}>
                                View All ({stats.inquiriesCount}) →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
