import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1, height, width }) => {
    const shimmerStyle = {
        background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px'
    };

    const renderCardSkeleton = () => (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginBottom: '1.5rem'
        }}>
            {/* Header */}
            <div style={{
                ...shimmerStyle,
                height: '24px',
                width: '60%',
                marginBottom: '1.5rem'
            }}></div>

            {/* Content lines */}
            <div style={{ ...shimmerStyle, height: '16px', width: '100%', marginBottom: '0.75rem' }}></div>
            <div style={{ ...shimmerStyle, height: '16px', width: '90%', marginBottom: '0.75rem' }}></div>
            <div style={{ ...shimmerStyle, height: '16px', width: '80%', marginBottom: '1.5rem' }}></div>

            {/* Footer */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
            }}>
                <div style={{ ...shimmerStyle, height: '40px', width: '120px' }}></div>
                <div style={{ ...shimmerStyle, height: '40px', width: '120px' }}></div>
            </div>
        </div>
    );

    const renderTextSkeleton = () => (
        <div style={{
            ...shimmerStyle,
            height: height || '16px',
            width: width || '100%',
            marginBottom: '0.75rem'
        }}></div>
    );

    const renderImageSkeleton = () => (
        <div style={{
            ...shimmerStyle,
            height: height || '200px',
            width: width || '100%',
            marginBottom: '1rem'
        }}></div>
    );

    const renderInputSkeleton = () => (
        <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
                ...shimmerStyle,
                height: '14px',
                width: '120px',
                marginBottom: '0.5rem'
            }}></div>
            <div style={{
                ...shimmerStyle,
                height: '44px',
                width: '100%'
            }}></div>
        </div>
    );

    const renderToggleSkeleton = () => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            background: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '1rem'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    ...shimmerStyle,
                    height: '18px',
                    width: '150px',
                    marginBottom: '0.5rem'
                }}></div>
                <div style={{
                    ...shimmerStyle,
                    height: '14px',
                    width: '250px'
                }}></div>
            </div>
            <div style={{
                ...shimmerStyle,
                height: '34px',
                width: '60px',
                borderRadius: '34px'
            }}></div>
        </div>
    );

    const renderBannerSkeleton = () => (
        <div style={{
            padding: '1.25rem',
            border: '2px solid #e5e7eb',
            borderRadius: '15px',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            background: '#fafafa',
            marginBottom: '1rem'
        }}>
            <div style={{
                ...shimmerStyle,
                width: '100px',
                height: '60px',
                borderRadius: '8px',
                flexShrink: 0
            }}></div>
            <div style={{ flex: 1 }}>
                <div style={{
                    ...shimmerStyle,
                    height: '18px',
                    width: '60%',
                    marginBottom: '0.5rem'
                }}></div>
                <div style={{
                    ...shimmerStyle,
                    height: '14px',
                    width: '80%',
                    marginBottom: '0.5rem'
                }}></div>
                <div style={{
                    ...shimmerStyle,
                    height: '24px',
                    width: '60px',
                    borderRadius: '20px'
                }}></div>
            </div>
            <div style={{
                ...shimmerStyle,
                height: '36px',
                width: '80px',
                borderRadius: '8px'
            }}></div>
        </div>
    );

    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return renderCardSkeleton();
            case 'text':
                return renderTextSkeleton();
            case 'image':
                return renderImageSkeleton();
            case 'input':
                return renderInputSkeleton();
            case 'toggle':
                return renderToggleSkeleton();
            case 'banner':
                return renderBannerSkeleton();
            default:
                return renderCardSkeleton();
        }
    };

    return (
        <>
            <style>
                {`
                    @keyframes shimmer {
                        0% {
                            background-position: -200% 0;
                        }
                        100% {
                            background-position: 200% 0;
                        }
                    }
                `}
            </style>
            {Array.from({ length: count }, (_, i) => (
                <div key={i}>{renderSkeleton()}</div>
            ))}
        </>
    );
};

export default LoadingSkeleton;
