import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth(); // Token is handled by interceptor in api.js, but keeping for context if needed elsewhere, though api.js handles it.

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.delete(id);
            alert('User deleted successfully');
            fetchUsers(); // Refresh
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const user = users.find(u => u.id === id);
            await userAPI.update(id, { role: newRole, status: user.status });
            alert('User role updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Error updating role');
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case 'admin': return { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' };
            case 'farmer': return { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' };
            case 'buyer': return { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' };
            case 'transporter': return { bg: '#f3e8ff', text: '#9333ea', border: '#e9d5ff' };
            default: return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
        }
    };

    if (loading) return (
        <div style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading Users...</div>
        </div>
    );

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem' }}>User Management 👥</h1>
                    <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', color: 'var(--text-secondary)' }}>
                        Total Users: <strong>{users.length}</strong>
                    </div>
                </div>

                <div className="table-responsive" style={{ background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>User</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Email</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Joined</th>
                                <th style={{ padding: '1.2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                const roleStyle = getRoleStyle(user.role);
                                return (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: roleStyle.bg, color: roleStyle.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {user.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-light)' }}>{user.email}</td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    borderRadius: '12px',
                                                    border: `1px solid ${roleStyle.border}`,
                                                    background: roleStyle.bg,
                                                    color: roleStyle.text,
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    outline: 'none'
                                                }}
                                            >
                                                <option value="buyer">Buyer</option>
                                                <option value="farmer">Farmer</option>
                                                <option value="transporter">Transporter</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                            {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'white',
                                                    color: '#ef4444',
                                                    border: '1px solid #fee2e2',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'white'; }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
