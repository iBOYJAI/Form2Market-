/**
 * Buyer Dashboard
 * Browse and filter products with significant visual improvements
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

// Icons
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

const MessageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const BuyerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await productAPI.getCategories();
            // Ensure unique categories
            const uniqueCats = [...new Set(response.data.categories)];
            setCategories(uniqueCats);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchProducts = async (filterParams = {}) => {
        setLoading(true);
        try {
            const response = await productAPI.getAll(filterParams);
            setProducts(response.data.products);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const filterParams = {};

        if (filters.category) filterParams.category = filters.category;
        if (filters.minPrice) filterParams.minPrice = filters.minPrice;
        if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
        if (filters.search) filterParams.search = filters.search;

        fetchProducts(filterParams);
    };

    const handleClearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        });
        fetchProducts();
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                        Browse Fresh Produce
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Direct from local farmers to your table.</p>
                </div>
                <Link to="/buyer/inquiries" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageIcon /> My Inquiries
                </Link>
            </div>

            {/* Filter Section */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>

                    {/* Search */}
                    <div style={{ flex: '2 1 300px', position: 'relative' }}>
                        <SearchIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', width: '18px' }} />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search for vegetables, fruits..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div style={{ flex: '1 1 150px', position: 'relative' }}>
                        <FilterIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', width: '18px' }} />
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                appearance: 'none',
                                background: 'white'
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 200px' }}>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Min ₹"
                            min="0"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #e2e8f0',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Max ₹"
                            min="0"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #e2e8f0',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="btn btn-secondary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}><BoxIcon style={{ width: '64px', height: '64px' }} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No products found</h3>
                    <p style={{ color: 'var(--text-light)' }}>Try refining your search criteria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.map(product => (
                        <div key={product.id} className="glass" style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '220px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    {product.image_path ? (
                                        <img
                                            src={product.image_path}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                        />
                                    ) : (
                                        <span style={{ color: '#cbd5e1' }}><BoxIcon /></span>
                                    )}
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.95)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary-dark)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {product.category}
                                    </div>
                                    {product.status === 'pending' && (
                                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                            New
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>{product.name}</h3>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{product.price}<span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: '400' }}>/kg</span></span>
                                    </div>

                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span>Available: <strong>{product.quantity} kg</strong></span>
                                        <span>Farmer: {product.farmer_name}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;
