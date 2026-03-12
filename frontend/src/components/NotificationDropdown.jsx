/**
 * Notification Dropdown Component
 * Shows recent notifications
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/api';

const NotificationDropdown = ({ notifications, onClose, onMarkRead }) => {
    const navigate = useNavigate();

    const handleItemClick = async (notification) => {
        if (!notification.is_read) {
            try {
                await notificationAPI.markRead(notification.id);
                onMarkRead(notification.id);
            } catch (err) {
                console.error('Failed to mark read', err);
            }
        }
        onClose();
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllRead();
            notifications.forEach(n => onMarkRead(n.id));
        } catch (err) {
            console.error('Failed to mark all read', err);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            width: '320px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
        }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>Notifications</h3>
                {notifications.some(n => !n.is_read) && (
                    <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>
                        Mark all read
                    </button>
                )}
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                        No notifications yet
                    </div>
                ) : (
                    notifications.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid #f8fafc',
                                cursor: 'pointer',
                                background: item.is_read ? 'white' : '#f0f9ff',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={e => e.currentTarget.style.background = item.is_read ? 'white' : '#f0f9ff'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: item.is_read ? '500' : '700', fontSize: '0.9rem', color: '#334155' }}>{item.title}</span>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{item.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
