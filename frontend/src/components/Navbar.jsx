/**
* Navbar Component
* Navigation bar with role-based menu items
*/

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { notificationAPI } from '../services/api';
import NotificationDropdown from './NotificationDropdown';
// used simple emojis for icons to avoid dependency issues
// Actually, I'll stick to emojis or simple <span> icons if I can't confirm library.
// Wait, step 755 showed package.json dependencies: react, react-dom, react-router-dom, axios. NO lucide-react.
// I will use simple inline SVGs or Emojis.
import LogoIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Scene Elements/PNG/plant-1.png';
import BellIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/svg/ni-bell.svg';
import TruckIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/svg/ni-truck-location.svg';

const Navbar = () => {
    const { user, logout, isFarmer, isBuyer, isAdmin } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Optional: Poll every 30s
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await notificationAPI.getAll();
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    // Hide Navbar on Login and Register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (isAdmin()) return '/admin/dashboard';
        if (isFarmer()) return '/farmer/dashboard';
        if (isBuyer()) return '/buyer/dashboard';
        return '/';
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to={user ? getDashboardLink() : '/'} className="nav-logo">
                    <img src={LogoIcon} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    {settings.site_name}
                </Link>

                <div className="nav-menu">
                    {!user ? (
                        /* Public Menu */
                        <>
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/about" className="nav-link">About</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link btn-primary">Register</Link>
                        </>
                    ) : (
                        /* Logged In Menu */
                        <>
                            {isFarmer() && (
                                <>
                                    <Link to="/farmer/dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/farmer/products/add" className="nav-link">Add Product</Link>
                                    <Link to="/logistics/post-job" className="nav-link">
                                        <img src={TruckIcon} alt="Transport" style={{ width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle' }} />
                                        Request Transport
                                    </Link>
                                    <Link to="/logistics/my-jobs" className="nav-link">My Requests</Link>
                                </>
                            )}

                            {user.role === 'transporter' && (
                                <>
                                    <Link to="/transporter/dashboard" className="nav-link">
                                        <img src={TruckIcon} alt="Jobs" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                                        Find Jobs
                                    </Link>
                                    <Link to="/transporter/deliveries" className="nav-link">My Deliveries</Link>
                                </>
                            )}

                            {isBuyer() && (
                                <>
                                    <Link to="/buyer/dashboard" className="nav-link">Browse Products</Link>
                                    <Link to="/buyer/inquiries" className="nav-link">My Inquiries</Link>
                                    <Link to="/logistics/post-job" className="nav-link">
                                        <img src={TruckIcon} alt="Transport" style={{ width: '18px', height: '18px', marginRight: '4px', verticalAlign: 'middle' }} />
                                        Request Transport
                                    </Link>
                                    <Link to="/logistics/my-jobs" className="nav-link">My Requests</Link>
                                </>
                            )}

                            {isAdmin() && (
                                <>
                                    <Link to="/admin/dashboard" className="nav-link">Overview</Link>
                                    <Link to="/admin/users" className="nav-link">Users</Link>
                                    <Link to="/admin/messages" className="nav-link">Inbox</Link>
                                </>
                            )}

                            <div className="nav-user" style={{ marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Notification Bell */}
                                <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setShowNotifications(!showNotifications)}>
                                    <img src={BellIcon} alt="Notifications" style={{ width: '24px', height: '24px' }} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ef4444',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '0.7rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            border: '2px solid white'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                    {showNotifications && (
                                        <NotificationDropdown
                                            notifications={notifications}
                                            onClose={() => setShowNotifications(false)}
                                            onMarkRead={handleMarkRead}
                                        />
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
                                    <span className="user-name" style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>{user.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize' }}>
                                        {user.role}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="btn-logout" style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
