import React, { useState } from 'react';

// Import assets from the simplified gallery folder
// Ecommerce
import eco1 from '../assets/admin/gallery/ecommerce-1.png';
import eco2 from '../assets/admin/gallery/ecommerce-2.png';
import eco3 from '../assets/admin/gallery/ecommerce-3.png';
import eco4 from '../assets/admin/gallery/ecommerce-4.png';
import eco5 from '../assets/admin/gallery/ecommerce-5.png';

// People
import people1 from '../assets/admin/gallery/people-1.png';
import people2 from '../assets/admin/gallery/people-2.png';
import people3 from '../assets/admin/gallery/people-3.png';
import people4 from '../assets/admin/gallery/people-4.png';
import people5 from '../assets/admin/gallery/people-5.png';

// Avatars
import avatar1 from '../assets/admin/gallery/avatar-1.png';
import avatar2 from '../assets/admin/gallery/avatar-2.png';

const ASSET_CATEGORIES = {
    'Ecommerce': [eco1, eco2, eco3, eco4, eco5],
    'People': [people1, people2, people3, people4, people5],
    'Avatars': [avatar1, avatar2]
};

// Icons modules
const LinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

const UploadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const ImageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const ImageUploader = ({
    currentImage,
    onImageSelect,
    allowUrl = true,
    allowUpload = true,
    allowAssetBrowser = true
}) => {
    const [activeTab, setActiveTab] = useState('url'); // url, upload, assets
    const [dragActive, setDragActive] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Ecommerce');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {
        // Create a fake URL for preview purposes since we don't have backend upload yet
        const fileUrl = URL.createObjectURL(file);
        onImageSelect(fileUrl);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                {allowUrl && (
                    <button
                        type="button"
                        onClick={() => setActiveTab('url')}
                        style={{
                            padding: '0.75rem 1rem',
                            color: activeTab === 'url' ? '#3b82f6' : '#6b7280',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'url' ? '2px solid #3b82f6' : '2px solid transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <LinkIcon /> URL
                    </button>
                )}
                {allowUpload && (
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        style={{
                            padding: '0.75rem 1rem',
                            color: activeTab === 'upload' ? '#3b82f6' : '#6b7280',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'upload' ? '2px solid #3b82f6' : '2px solid transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <UploadIcon /> Upload
                    </button>
                )}
                {allowAssetBrowser && (
                    <button
                        type="button"
                        onClick={() => setActiveTab('assets')}
                        style={{
                            padding: '0.75rem 1rem',
                            color: activeTab === 'assets' ? '#3b82f6' : '#6b7280',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'assets' ? '2px solid #3b82f6' : '2px solid transparent',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <ImageIcon /> Assets
                    </button>
                )}
            </div>

            {/* Content */}
            <div style={{ minHeight: '200px' }}>
                {/* URL Input */}
                {activeTab === 'url' && (
                    <div>
                        <input
                            type="text"
                            value={currentImage || ''}
                            onChange={(e) => onImageSelect(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '10px',
                                border: '2px solid #e5e7eb',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            Paste a direct link to an image.
                        </p>
                    </div>
                )}

                {/* Upload Input */}
                {activeTab === 'upload' && (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${dragActive ? '#3b82f6' : '#e5e7eb'}`,
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            background: dragActive ? '#eff6ff' : '#f9fafb',
                            transition: 'all 0.2s'
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            id="file-upload"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                            <div style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                                <UploadIcon width="48" height="48" />
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                                Click to upload or drag and drop
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                        </label>
                    </div>
                )}

                {/* Asset Browser */}
                {activeTab === 'assets' && (
                    <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {Object.keys(ASSET_CATEGORIES).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        border: selectedCategory === cat ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                                        background: selectedCategory === cat ? '#eff6ff' : 'white',
                                        color: selectedCategory === cat ? '#1d4ed8' : '#374151',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '1rem',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            padding: '0.5rem'
                        }}>
                            {ASSET_CATEGORIES[selectedCategory].map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => onImageSelect(img)}
                                    style={{
                                        aspectRatio: '1',
                                        border: currentImage === img ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        background: '#f8fafc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#93c5fd'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = currentImage === img ? '#3b82f6' : '#e5e7eb'}
                                >
                                    <img
                                        src={img}
                                        alt={`Asset ${idx}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                    {currentImage === img && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px'
                                        }}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Preview */}
            {currentImage && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                        Preview
                    </p>
                    <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>
                        <img
                            src={currentImage}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div style="color: #ef4444; font-size: 0.9rem">❌ Failed to load image</div>';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
