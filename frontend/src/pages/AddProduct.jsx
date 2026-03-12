/**
 * Add/Edit Product Page
 * Redesigned with modern aesthetic and improved UX
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';

// Icons
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const ImageIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
);

const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

const AddProduct = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productAPI.getById(id);
            const product = response.data.product;
            setFormData({
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                description: product.description || ''
            });
            setExistingImage(product.image_path);
        } catch (err) {
            setError('Failed to load product details');
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file');
                return;
            }

            setImage(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Drag and Drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity);
            data.append('description', formData.description);

            if (image) {
                data.append('image', image);
            }

            if (isEdit) {
                await productAPI.update(id, data);
            } else {
                await productAPI.create(data);
            }

            navigate('/farmer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            console.error(err);
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="container" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem', maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/farmer/dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    <ArrowLeftIcon /> Back to Dashboard
                </Link>
            </div>

            <div className="glass" style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isEdit ? 'Update your product details and inventory.' : 'List a new product for buyers to discover.'}
                    </p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'center', border: '1px solid #fecaca' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Product Image</label>
                        <div
                            className={`upload-area ${dragActive ? 'active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                border: dragActive ? '2px dashed var(--primary-color)' : '2px dashed #cbd5e1',
                                borderRadius: 'var(--radius-lg)',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: dragActive ? 'rgba(98, 129, 65, 0.05)' : '#f8fafc',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />

                            {imagePreview || existingImage ? (
                                <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto' }}>
                                    <img
                                        src={imagePreview || existingImage}
                                        alt="Preview"
                                        style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
                                    />
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                        Click to change
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '2rem 0' }}>
                                    <div style={{ marginBottom: '1rem' }}><ImageIcon /></div>
                                    <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Click or Drag image here</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>JPG, PNG, GIF up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Product Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Organic Tomatoes"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    background: '#f8fafc'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f8fafc',
                                    cursor: 'pointer'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            >
                                <option value="">Select Category</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Grains">Grains</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Poultry">Poultry</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Price and Quantity */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Price per Unit (₹) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f8fafc'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label htmlFor="quantity" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Quantity Available *</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    background: '#f8fafc'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell buyers about your product..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                background: '#f8fafc'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderColor: '#ffffff80', borderTopColor: 'white' }}></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <SaveIcon />
                                    {isEdit ? 'Update Product' : 'List Product'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
