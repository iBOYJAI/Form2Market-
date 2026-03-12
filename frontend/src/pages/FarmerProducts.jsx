/**
 * Farmer Products Page
 * Manage all products in a dedicated view
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

// Icons
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const FilterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const FarmerProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter]);

    const fetchProducts = async () => {
        try {
            const response = await productAPI.getFarmerProducts();
            setProducts(response.data.products);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let result = [...products];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            );
        }

        if (categoryFilter) {
            result = result.filter(p => p.category === categoryFilter);
        }

        setFilteredProducts(result);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await productAPI.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const categories = [...new Set(products.map(p => p.category))];

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                        My Products
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your inventory and listings ({filteredProducts.length})</p>
                </div>
                <Link to="/farmer/products/add" className="btn btn-primary">
                    <PlusIcon /> Add New Product
                </Link>
            </div>

            {/* Filters */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                    <SearchIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', width: '18px' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #e2e8f0',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <FilterIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', width: '18px' }} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            cursor: 'pointer',
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
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}><BoxIcon style={{ width: '64px', height: '64px' }} /></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No products found</h3>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Try adjusting your search or filters.</p>
                    <button onClick={() => { setSearchTerm(''); setCategoryFilter(''); }} className="btn btn-secondary">
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} className="glass" style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '1px solid #f1f5f9',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform 0.2s'
                        }}>
                            <div style={{ height: '200px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                    {product.category}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-dark)', margin: 0 }}>{product.name}</h3>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>₹{product.price}</span>
                                    <span style={{ fontSize: '0.9rem', padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                        Stock: {product.quantity}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <Link
                                        to={`/farmer/products/edit/${product.id}`}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                                    >
                                        <EditIcon /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn"
                                        style={{ padding: '0.5rem', fontSize: '0.9rem', background: '#fee2e2', color: '#ef4444', border: 'none' }}
                                    >
                                        <TrashIcon /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmerProducts;
