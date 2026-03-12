import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productAPI } from '../services/api';

console.log('AdminProducts loaded. APIs:', { adminAPI, productAPI });

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        console.log('fetchProducts called. productAPI:', productAPI);
        try {
            setLoading(true);
            const response = await productAPI.getAll({ status: 'pending' }); // Admin sees all if status not sent, but we might want to prioritize pending or just show all.
            // Actually, let's fetch ALL products to manage them all.
            const allResponse = await productAPI.getAll();
            if (allResponse.data.success) {
                setProducts(allResponse.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const handleAction = async (id, action) => {
        try {
            if (action === 'Approve') {
                await adminAPI.approveProduct(id);
                alert('Product Approved Successfully!');
            } else if (action === 'Reject') {
                const reason = prompt("Enter rejection reason:");
                if (!reason) return; // Cancel if no reason
                await adminAPI.rejectProduct(id, reason);
                alert('Product Rejected Successfully!');
            }
            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error(`Error ${action} product:`, error);
            alert(`Failed to ${action} product`);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'active': return { bg: '#dcfce7', text: '#16a34a' };
            case 'pending': return { bg: '#fef9c3', text: '#ca8a04' };
            case 'rejected': return { bg: '#fee2e2', text: '#dc2626' };
            default: return { bg: '#f1f5f9', text: '#475569' };
        }
    };

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary-dark)', fontSize: '2rem' }}>Product Management 🥕</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', color: 'var(--text-secondary)' }}>
                            Total: <strong>{products.length}</strong>
                        </span>
                    </div>
                </div>

                <div className="table-responsive" style={{ background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Product Name</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Farmer</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Price (/kg)</th>
                                <th style={{ padding: '1.2rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1.2rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No products found.</td></tr>
                            ) : (
                                products.map(product => {
                                    const statusStyle = getStatusColor(product.status);
                                    return (
                                        <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                                            <td style={{ padding: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {product.image_path && (
                                                        <img
                                                            src={`http://localhost:5000${product.image_path}`}
                                                            alt={product.name}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                                                        />
                                                    )}
                                                    {product.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem', color: 'var(--text-light)' }}>
                                                {product.farmer_name || product.farmer || 'Unknown'}
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.farmer_email}</div>
                                            </td>
                                            <td style={{ padding: '1.2rem', fontWeight: '500' }}>₹{product.price}</td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.text,
                                                    borderRadius: '20px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    {product.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(product.id, 'Approve')}
                                                                style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(product.id, 'Reject')}
                                                                style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {product.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleAction(product.id, 'Reject')}
                                                            style={{ padding: '0.5rem 1rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                    {product.status === 'rejected' && (
                                                        <button
                                                            onClick={() => handleAction(product.id, 'Approve')}
                                                            style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                                                        >
                                                            Re-Approve
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
