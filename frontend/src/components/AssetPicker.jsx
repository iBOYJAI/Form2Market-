import React, { useState } from 'react';
import { getCategorizedAssets } from '../utils/assetRegistry';

const AssetPicker = ({ onSelect, selectedPath }) => {
    const assets = getCategorizedAssets();
    const categories = Object.keys(assets).filter(cat => assets[cat].length > 0);
    const [activeCategory, setActiveCategory] = useState('Ecommerce');

    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
            {/* Category Tabs */}
            <div style={{
                display: 'flex',
                overflowX: 'auto',
                borderBottom: '1px solid #e2e8f0',
                background: '#f8fafc',
                padding: '0.5rem'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: activeCategory === cat ? '#fff' : 'transparent',
                            color: activeCategory === cat ? '#2563eb' : '#64748b',
                            borderRadius: '8px',
                            fontWeight: activeCategory === cat ? '600' : '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: activeCategory === cat ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            marginRight: '0.5rem'
                        }}
                    >
                        {cat} ({assets[cat].length})
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            <div style={{
                padding: '1rem',
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '1rem'
            }}>
                {assets[activeCategory].map((asset, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(asset.path)}
                        style={{
                            cursor: 'pointer',
                            border: selectedPath === asset.path ? '3px solid #3b82f6' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative',
                            aspectRatio: '1',
                            transition: 'all 0.2s'
                        }}
                    >
                        <img
                            src={asset.src}
                            alt={asset.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            title={asset.name}
                        />
                        {selectedPath === asset.path && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                background: '#3b82f6',
                                color: 'white',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottomLeftRadius: '8px',
                                fontSize: '12px'
                            }}>
                                ✓
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ padding: '0.75rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
                Selected: <span style={{ fontFamily: 'monospace', color: '#0f172a' }}>{selectedPath || 'None'}</span>
            </div>
        </div>
    );
};

export default AssetPicker;
