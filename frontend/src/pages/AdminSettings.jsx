import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import '../index.css';

// Importing Assets
import settingsHero from '../assets/admin/settings-hero.png';
import generalIcon from '../assets/admin/icon-general.png';
import systemIcon from '../assets/admin/icon-system.png';

// Icons Components
const BuildingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="22" x2="9" y2="22.01"></line>
        <line x1="15" y1="22" x2="15" y2="22.01"></line>
        <line x1="12" y1="22" x2="12" y2="22.01"></line>
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="4" y1="10" x2="20" y2="10"></line>
        <line x1="4" y1="14" x2="20" y2="14"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
        <line x1="4" y1="6" x2="20" y2="6"></line>
    </svg>
);

const MoneyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

const AdminSettings = () => {
    const { refreshSettings } = useSettings();
    const [settings, setSettings] = useState({
        platform_fee: 5,
        support_email: 'support@form2market.com',
        enable_registration: true,
        maintenance_mode: false,
        site_name: 'Form2Market',
        admin_notifications: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [pendingMaintenanceValue, setPendingMaintenanceValue] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await adminAPI.getSettings();
            if (response.data.success) {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'maintenance_mode') {
            setPendingMaintenanceValue(checked);
            setShowMaintenanceModal(true);
            return;
        }

        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleMaintenanceConfirm = () => {
        setSettings(prev => ({
            ...prev,
            maintenance_mode: pendingMaintenanceValue
        }));
        setShowMaintenanceModal(false);
        showToast(
            pendingMaintenanceValue
                ? 'Maintenance mode enabled'
                : 'Maintenance mode disabled',
            'warning'
        );
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await adminAPI.updateSettings(settings);
            if (response.data.success) {
                showToast('Settings saved successfully', 'success');
                if (refreshSettings) {
                    refreshSettings();
                }
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            showToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <LoadingSkeleton type="text" count={1} height={60} width={400} />
                    <LoadingSkeleton type="card" count={2} height={300} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem', fontFamily: "'Outfit', sans-serif" }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '3rem',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        textAlign: 'center'
                    }}>
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h1 style={{
                                color: '#1e293b',
                                fontSize: '3rem',
                                marginBottom: '0.5rem',
                                fontWeight: '800',
                                letterSpacing: '-0.02em'
                            }}>
                                Platform Settings
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px' }}>
                                Manage global configurations, fees, and system preferences.
                            </p>
                        </div>
                        <img
                            src={settingsHero}
                            alt="Settings Illustration"
                            style={{
                                width: '180px',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />
                    </div>

                    {/* Settings Form */}
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                            {/* General Settings Card */}
                            <div style={{
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                                animation: 'slideUp 0.5s ease-out'
                            }}>
                                <div style={{
                                    padding: '2rem',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <img src={generalIcon} alt="General" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: '700' }}>
                                            General Configuration
                                        </h2>
                                        <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                                            Basic platform info
                                        </p>
                                    </div>
                                </div>

                                <div style={{ padding: '2rem' }}>
                                    {/* Site Name */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                                            Site Name
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="site_name"
                                                value={settings.site_name}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    paddingLeft: '3rem',
                                                    borderRadius: '12px',
                                                    border: '2px solid #e2e8f0',
                                                    fontSize: '1rem',
                                                    background: '#f8fafc',
                                                    outline: 'none'
                                                }}
                                            />
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                                                <BuildingIcon />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Platform Fee */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                                            Platform Fee (%)
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                name="platform_fee"
                                                value={settings.platform_fee}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    paddingLeft: '3rem',
                                                    borderRadius: '12px',
                                                    border: '2px solid #e2e8f0',
                                                    fontSize: '1rem',
                                                    background: '#f8fafc',
                                                    outline: 'none'
                                                }}
                                            />
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                                                <MoneyIcon />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Support Email */}
                                    <div style={{ marginBottom: '0' }}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#334155', fontSize: '0.95rem' }}>
                                            Support Email
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                name="support_email"
                                                value={settings.support_email}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    paddingLeft: '3rem',
                                                    borderRadius: '12px',
                                                    border: '2px solid #e2e8f0',
                                                    fontSize: '1rem',
                                                    background: '#f8fafc',
                                                    outline: 'none'
                                                }}
                                            />
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                                                <MailIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System Settings Card */}
                            <div style={{
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                overflow: 'hidden',
                                animation: 'slideUp 0.6s ease-out'
                            }}>
                                <div style={{
                                    padding: '2rem',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    <img src={systemIcon} alt="System" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a', fontWeight: '700' }}>
                                            System Configuration
                                        </h2>
                                        <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                                            Access & Maintenance
                                        </p>
                                    </div>
                                </div>

                                <div style={{ padding: '2rem' }}>
                                    {/* User Registration Toggle */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '12px', color: '#2563eb' }}>
                                                <UserIcon />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>
                                                    User Registration
                                                </h4>
                                                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                                    Allow new signups
                                                </p>
                                            </div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="enable_registration"
                                                checked={settings.enable_registration}
                                                onChange={handleChange}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: settings.enable_registration ? '#3b82f6' : '#cbd5e1',
                                                transition: '0.4s',
                                                borderRadius: '34px'
                                            }}></span>
                                            <span style={{
                                                position: 'absolute',
                                                content: '',
                                                height: '22px', width: '22px',
                                                left: settings.enable_registration ? '30px' : '4px',
                                                bottom: '4px',
                                                backgroundColor: 'white',
                                                transition: '0.4s',
                                                borderRadius: '50%'
                                            }}></span>
                                        </label>
                                    </div>

                                    {/* Admin Notifications Toggle */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '12px', color: '#d97706' }}>
                                                <BellIcon />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>
                                                    Admin Alerts
                                                </h4>
                                                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                                                    Email notifications
                                                </p>
                                            </div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="admin_notifications"
                                                checked={settings.admin_notifications}
                                                onChange={handleChange}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: settings.admin_notifications ? '#f59e0b' : '#cbd5e1',
                                                transition: '0.4s',
                                                borderRadius: '34px'
                                            }}></span>
                                            <span style={{
                                                position: 'absolute',
                                                content: '',
                                                height: '22px', width: '22px',
                                                left: settings.admin_notifications ? '30px' : '4px',
                                                bottom: '4px',
                                                backgroundColor: 'white',
                                                transition: '0.4s',
                                                borderRadius: '50%'
                                            }}></span>
                                        </label>
                                    </div>

                                    {/* Maintenance Mode Toggle */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem',
                                        background: settings.maintenance_mode ? '#fef2f2' : 'white',
                                        borderRadius: '16px',
                                        border: settings.maintenance_mode ? '1px solid #ef4444' : '1px solid #e2e8f0'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: settings.maintenance_mode ? '#fee2e2' : '#f3f4f6', padding: '0.75rem', borderRadius: '12px', color: settings.maintenance_mode ? '#ef4444' : '#64748b' }}>
                                                <AlertIcon />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem', color: settings.maintenance_mode ? '#ef4444' : '#1e293b', fontWeight: '600' }}>
                                                    Maintenance Mode
                                                </h4>
                                                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.875rem', color: settings.maintenance_mode ? '#b91c1c' : '#64748b' }}>
                                                    Disable site access
                                                </p>
                                            </div>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="maintenance_mode"
                                                checked={settings.maintenance_mode}
                                                onChange={handleChange}
                                                style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                                position: 'absolute',
                                                top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: settings.maintenance_mode ? '#ef4444' : '#cbd5e1',
                                                transition: '0.4s',
                                                borderRadius: '34px'
                                            }}></span>
                                            <span style={{
                                                position: 'absolute',
                                                content: '',
                                                height: '22px', width: '22px',
                                                left: settings.maintenance_mode ? '30px' : '4px',
                                                bottom: '4px',
                                                backgroundColor: 'white',
                                                transition: '0.4s',
                                                borderRadius: '50%'
                                            }}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '1.25rem 4rem',
                                    background: saving ? '#cbd5e1' : '#1e293b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    boxShadow: saving ? 'none' : '0 10px 25px -5px rgba(30, 41, 59, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        <SaveIcon /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}

            {/* Maintenance Mode Confirmation Modal */}
            <Modal
                isOpen={showMaintenanceModal}
                onClose={() => setShowMaintenanceModal(false)}
                title={pendingMaintenanceValue ? "Enable Maintenance Mode?" : "Disable Maintenance Mode?"}
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setShowMaintenanceModal(false)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#f1f5f9',
                                color: '#475569',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                marginRight: '1rem'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleMaintenanceConfirm}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: pendingMaintenanceValue ? '#ef4444' : '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Confirm
                        </button>
                    </>
                }
            >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ color: pendingMaintenanceValue ? '#ef4444' : '#22c55e', marginBottom: '1rem' }}>
                        {pendingMaintenanceValue ? <AlertIcon /> : <CheckIcon />}
                    </div>

                    {pendingMaintenanceValue ? (
                        <>
                            <h3 style={{ color: '#b91c1c', marginBottom: '1rem' }}>
                                Warning: Site will be offline
                            </h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                                Users will not be able to access the platform. Only administrators can log in.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 style={{ color: '#059669', marginBottom: '1rem' }}>
                                Bringing site back online
                            </h3>
                            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                                The platform will be fully accessible to all users immediately.
                            </p>
                        </>
                    )}
                </div>
            </Modal>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                `}
            </style>
        </>
    );
};

export default AdminSettings;
