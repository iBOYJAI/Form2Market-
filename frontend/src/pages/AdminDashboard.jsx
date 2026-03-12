import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Assets
import UserIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/waving.png';
import ProductIcon from '../assets/images/0026-cooking-food-illustrations/DrawKit-cooking-kitchen-food-vector-illustration/PNG/DrawKit-cooking-kitchen-food-vector-illustrations-09.png';
import OrderIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/man-holding-box.png';
import InquiryIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/woman-sitting-texting.png';

// Module Icons
import UserMgmtIcon from '../assets/images/0010-people-working-illustrations/DrawKit - People Working Illustration Pack/PNG/character 7.png';
import ProductMgmtIcon from '../assets/images/0026-cooking-food-illustrations/DrawKit-cooking-kitchen-food-vector-illustration/PNG/DrawKit-cooking-kitchen-food-vector-illustrations-05.png';
import MessageIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/woman-sitting-laptop.png';
import SettingsIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/man-sitting-laptop.png';
import SiteIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Characters/PNG/graph-man.png';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Stats Data
    const stats = [
        { title: 'Total Users', value: '125', img: UserIcon, color: '#e0f2fe', text: '#0284c7' },
        { title: 'Active Products', value: '48', img: ProductIcon, color: '#dcfce7', text: '#16a34a' },
        { title: 'New Orders', value: '12', img: OrderIcon, color: '#fef9c3', text: '#ca8a04' },
        { title: 'Inquiries', value: '5', img: InquiryIcon, color: '#fee2e2', text: '#dc2626' },
    ];

    // Modules Data
    const modules = [
        { title: 'User Management', desc: 'Manage farmers, buyers, and transporters', link: '/admin/users', img: UserMgmtIcon },
        { title: 'Product Management', desc: 'Review, approve, or edit listings', link: '/admin/products', img: ProductMgmtIcon },
        { title: 'Messages & Support', desc: 'View contact form inquiries', link: '/admin/messages', img: MessageIcon },
        { title: 'Platform Settings', desc: 'Configure fees, regions, and categories', link: '/admin/settings', img: SettingsIcon },
        { title: 'Site Management', desc: 'CMS for banners and announcements', link: '/admin/site', img: SiteIcon },
    ];

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '3rem 0', boxShadow: 'var(--shadow-sm)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong style={{ color: 'var(--primary-color)' }}>{user?.name || 'Administrator'}</strong>. Here's your daily overview.</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '2rem' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            border: '1px solid #f1f5f9',
                            transition: 'transform 0.2s',
                            cursor: 'default'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '12px',
                                background: stat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px'
                            }}>
                                <img src={stat.img} alt={stat.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary-dark)', fontWeight: '800' }}>{stat.value}</h3>
                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div style={{ height: '30px', width: '6px', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                    <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>Platform Modules</h2>
                </div>

                {/* Modules Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    {modules.map((mod, index) => (
                        <Link to={mod.link} key={index} style={{ textDecoration: 'none' }}>
                            <div className="feature-card" style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '20px',
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid #f1f5f9',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                            >
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    flexShrink: 0,
                                    background: '#f8fafc',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '15px'
                                }}>
                                    <img src={mod.img} alt={mod.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontWeight: '700' }}>{mod.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem', marginBottom: '1rem' }}>{mod.desc}</p>
                                    <span style={{
                                        color: 'var(--primary-color)',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        background: 'rgba(var(--primary-rgb), 0.1)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '50px',
                                        width: 'fit-content'
                                    }}>
                                        Manage
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
