import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000, position = 'top-right' }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    icon: '✅'
                };
            case 'error':
                return {
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    icon: '❌'
                };
            case 'warning':
                return {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    icon: '⚠️'
                };
            case 'info':
            default:
                return {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    icon: 'ℹ️'
                };
        }
    };

    const getPositionStyles = () => {
        const baseStyles = {
            position: 'fixed',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out'
        };

        switch (position) {
            case 'top-left':
                return { ...baseStyles, top: '20px', left: '20px' };
            case 'top-center':
                return { ...baseStyles, top: '20px', left: '50%', transform: 'translateX(-50%)' };
            case 'top-right':
            default:
                return { ...baseStyles, top: '20px', right: '20px' };
            case 'bottom-left':
                return { ...baseStyles, bottom: '20px', left: '20px' };
            case 'bottom-center':
                return { ...baseStyles, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-right':
                return { ...baseStyles, bottom: '20px', right: '20px' };
        }
    };

    const typeStyles = getTypeStyles();
    const positionStyles = getPositionStyles();

    return (
        <>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideOut {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                    }
                `}
            </style>
            <div style={{
                ...positionStyles,
                background: typeStyles.background,
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: '300px',
                maxWidth: '500px'
            }}>
                <span style={{ fontSize: '1.5rem' }}>{typeStyles.icon}</span>
                <span style={{ flex: 1, fontWeight: '500' }}>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                    ×
                </button>
            </div>
        </>
    );
};

export default Toast;
