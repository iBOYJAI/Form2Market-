import React, { useEffect } from 'react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    footer
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { maxWidth: '400px' };
            case 'md':
                return { maxWidth: '600px' };
            case 'lg':
                return { maxWidth: '800px' };
            case 'xl':
                return { maxWidth: '1000px' };
            default:
                return { maxWidth: '600px' };
        }
    };

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(50px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                }}
                onClick={handleBackdropClick}
            >
                <div
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                        width: '100%',
                        ...getSizeStyles(),
                        animation: 'slideUp 0.3s ease-out',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            {title && (
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1f2937'
                                }}>
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: '#f3f4f6',
                                        border: 'none',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        color: '#6b7280',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        marginLeft: 'auto'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#e5e7eb';
                                        e.target.style.color = '#1f2937';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#f3f4f6';
                                        e.target.style.color = '#6b7280';
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div style={{
                        padding: '2rem',
                        overflowY: 'auto',
                        flex: 1
                    }}>
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end'
                        }}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
