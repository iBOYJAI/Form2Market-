import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contactAPI } from '../services/api';

// Icons
import inboxIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/png/ni-inbox.png';
import archiveIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/png/ni-folders.png';
import replyIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/png/ni-paper-plane.png';
import deleteIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/png/ni-delete-right.png';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' or 'archived'
    const { token, isAdmin } = useAuth();
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await contactAPI.getAll({ archived: activeTab === 'archived' });
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchMessages();
    }, [isAdmin, navigate, token, activeTab]);

    const handleArchive = async (id) => {
        if (!window.confirm(`Are you sure you want to ${activeTab === 'inbox' ? 'archive' : 'delete'} this message?`)) return;
        try {
            if (activeTab === 'inbox') {
                await contactAPI.archive(id);
                alert('Message archived successfully');
            } else {
                await contactAPI.delete(id);
                alert('Message deleted permanently');
            }
            // Remove from local state immediately
            setMessages(prev => prev.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error processing message:', error);
            alert('Operation failed');
        }
    };

    const handleReply = (email, subject) => {
        const replySubject = `Re: ${subject}`;
        const body = `\n\n\n--------------------------------\nOriginal Message:\nSubject: ${subject}\n...`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(body)}`;
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Are you sure you want to restore this message to the inbox?')) return;
        try {
            await contactAPI.restore(id);
            alert('Message restored successfully');
            // Remove from local state immediately
            setMessages(prev => prev.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error restoring message:', error);
            alert('Restore failed');
        }
    };

    if (loading && messages.length === 0) {
        return (
            <div style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading Messages...</div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Contact Messages <img src={inboxIcon} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Inquiries from the contact form.</p>
                </div>

                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0' }}>
                    <button
                        onClick={() => setActiveTab('inbox')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'inbox' ? '3px solid var(--primary-color)' : '3px solid transparent',
                            color: activeTab === 'inbox' ? 'var(--primary-color)' : 'var(--text-secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        Inbox <img src={inboxIcon} alt="" style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                        onClick={() => setActiveTab('archived')}
                        style={{
                            padding: '1rem 2rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'archived' ? '3px solid var(--primary-color)' : '3px solid transparent',
                            color: activeTab === 'archived' ? 'var(--primary-color)' : 'var(--text-secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        Archived <img src={archiveIcon} alt="" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {messages.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '20px', padding: '4rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <img src={activeTab === 'inbox' ? inboxIcon : archiveIcon} alt="" style={{ width: '64px', height: '64px', opacity: 0.5 }} />
                        </div>
                        <h3 style={{ color: 'var(--primary-dark)', margin: 0 }}>No {activeTab} messages</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{activeTab === 'inbox' ? 'New inquiries will appear here.' : 'Archived messages will appear here.'}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid #f1f5f9',
                                transition: 'transform 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.1rem' }}>{msg.subject}</h3>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                                From: <strong>{msg.name}</strong> • {msg.email}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                                        {new Date(msg.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    {msg.message}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    {activeTab === 'archived' && (
                                        <button
                                            onClick={() => handleRestore(msg.id)}
                                            style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        >
                                            <img src={archiveIcon} alt="" style={{ width: '16px', height: '16px' }} />
                                            Restore
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleArchive(msg.id)}
                                        style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: activeTab === 'inbox' ? 'var(--text-secondary)' : '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <img src={activeTab === 'inbox' ? archiveIcon : deleteIcon} alt="" style={{ width: '16px', height: '16px' }} />
                                        {activeTab === 'inbox' ? 'Archive' : 'Delete Forever'}
                                    </button>
                                    <button
                                        onClick={() => handleReply(msg.email, msg.subject)}
                                        style={{ padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <img src={replyIcon} alt="" style={{ width: '16px', height: '16px', filter: 'brightness(0) invert(1)' }} />
                                        Reply via Email
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
