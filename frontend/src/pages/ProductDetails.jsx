/**
 * Product Details Page
 * Public view for buyers
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, inquiryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isBuyer } = useAuth();

    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productAPI.getById(id);
            setProduct(response.data.product);
        } catch (err) {
            setError('Failed to load product details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInquiry = async (e) => {
        e.preventDefault();

        if (!isBuyer()) {
            alert('Only registered buyers can send inquiries.');
            return;
        }

        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await inquiryAPI.create({
                product_id: parseInt(id),
                message
            });
            setSuccess('Inquiry sent! The farmer has been notified.');
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send inquiry');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--text-secondary)' }}>Product not found</h2>
                <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <ArrowLeftIcon /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                {/* Left: Image */}
                <div>
                    <div style={{
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        background: 'white',
                        boxShadow: 'var(--shadow-lg)',
                        aspectRatio: '4/3',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {product.image_path ? (
                            <img
                                src={product.image_path}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>No Image Available</div>
                        )}
                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: '600' }}>
                            {product.category}
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '1rem', lineHeight: '1.2' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Price</span>
                            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{product.price}</span>
                            <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}> / kg</span>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }}></div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Availability</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{product.quantity} kg</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--primary-dark)' }}>Description</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            {product.description || 'No detailed description available for this product.'}
                        </p>
                    </div>

                    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: '#f8fafc', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--secondary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)' }}>
                                <UserIcon />
                            </div>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sold by</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-dark)' }}>{product.farmer_name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Inquiry Form */}
                    <div style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', background: 'white' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-dark)' }}>
                            <MailIcon /> Contact Farmer
                        </h3>

                        {success ? (
                            <div style={{ padding: '1.5rem', background: '#ecfdf5', color: '#047857', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Queries Sent Successfully!</p>
                                <p style={{ fontSize: '0.9rem' }}>{product.farmer_name} will contact you soon.</p>
                                <button onClick={() => setSuccess('')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#047857', textDecoration: 'underline', cursor: 'pointer' }}>Send another message</button>
                            </div>
                        ) : (
                            isBuyer() ? (
                                <form onSubmit={handleInquiry}>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={`Hi ${product.farmer_name}, I'm interested in buying ${product.name}...`}
                                        required
                                        minLength="10"
                                        rows="4"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid #e2e8f0',
                                            marginBottom: '1rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                    />
                                    {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending...' : 'Send Inquiry'}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>You must be logged in as a buyer to contact the farmer.</p>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <a href="/login" className="btn btn-primary">Login</a>
                                        <a href="/register" className="btn btn-secondary">Register</a>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
