import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ImageUploader from '../components/ImageUploader';
import AssetPicker from '../components/AssetPicker';
import { getAssetUrl } from '../utils/assetRegistry';

// Importing Assets
import siteHero from '../assets/admin/site-hero.png';
import bannersIcon from '../assets/admin/section-banners.png';
import announcementsIcon from '../assets/admin/section-announcements.png';

// SVG Icons
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2 2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const PauseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
);

const InfoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const AlertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const WarningIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const AdminSite = () => {
    const [banners, setBanners] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Banner Modal States
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [bannerForm, setBannerForm] = useState({
        title: '',
        subtitle: '',
        image_path: '',
        link_url: '',
        display_order: 0,
        is_active: true,
        imageSource: 'asset' // 'asset' or 'upload'
    });

    // Announcement Modal States
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        content: '',
        type: 'info',
        show_on_homepage: true
    });

    // Confirmation Modal States
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const fetchData = async () => {
        try {
            const [bannersRes, announcementsRes] = await Promise.all([
                adminAPI.getBanners(),
                adminAPI.getAnnouncements()
            ]);

            if (bannersRes.data.success) {
                setBanners(bannersRes.data.banners);
            }
            if (announcementsRes.data.success) {
                setAnnouncements(announcementsRes.data.announcements);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Banner Functions
    const openBannerModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setBannerForm({
                title: banner.title,
                subtitle: banner.subtitle || '',
                image_path: banner.image_path,
                link_url: banner.link_url || '',
                display_order: banner.display_order,
                is_active: banner.is_active
            });
        } else {
            setEditingBanner(null);
            setBannerForm({
                title: '',
                subtitle: '',
                image_path: '',
                link_url: '',
                display_order: 0,
                is_active: true
            });
        }
        setShowBannerModal(true);
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await adminAPI.updateBanner(editingBanner.id, bannerForm);
                showToast('Banner updated successfully', 'success');
            } else {
                await adminAPI.createBanner(bannerForm);
                showToast('Banner created successfully', 'success');
            }
            setShowBannerModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save banner:', error);
            showToast('Failed to save banner', 'error');
        }
    };

    const handleDeleteBanner = (banner) => {
        setConfirmAction({
            title: 'Delete Banner',
            message: `Are you sure you want to delete "${banner.title}"?`,
            icon: <TrashIcon />,
            type: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteBanner(banner.id);
                    showToast('Banner deleted successfully', 'success');
                    fetchData();
                } catch (error) {
                    console.error('Failed to delete banner:', error);
                    showToast('Failed to delete banner', 'error');
                }
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const toggleBannerStatus = async (banner) => {
        try {
            await adminAPI.updateBanner(banner.id, { ...banner, is_active: !banner.is_active });
            showToast(`Banner ${!banner.is_active ? 'activated' : 'deactivated'}`, 'success');
            fetchData();
        } catch (error) {
            console.error('Failed to toggle banner:', error);
            showToast('Failed to update banner status', 'error');
        }
    };

    // Announcement Functions
    const openAnnouncementModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setAnnouncementForm({
                title: announcement.title,
                content: announcement.content,
                type: announcement.type,
                show_on_homepage: announcement.show_on_homepage
            });
        } else {
            setEditingAnnouncement(null);
            setAnnouncementForm({
                title: '',
                content: '',
                type: 'info',
                show_on_homepage: true
            });
        }
        setShowAnnouncementModal(true);
    };

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await adminAPI.updateAnnouncement(editingAnnouncement.id, announcementForm);
                showToast('Announcement updated successfully', 'success');
            } else {
                await adminAPI.createAnnouncement(announcementForm);
                showToast('Announcement posted successfully', 'success');
            }
            setShowAnnouncementModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save announcement:', error);
            showToast('Failed to save announcement', 'error');
        }
    };

    const handleDeleteAnnouncement = (announcement) => {
        setConfirmAction({
            title: 'Delete Announcement',
            message: `Are you sure you want to delete "${announcement.title}"?`,
            icon: <TrashIcon />,
            type: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteAnnouncement(announcement.id);
                    showToast('Announcement deleted successfully', 'success');
                    fetchData();
                } catch (error) {
                    console.error('Failed to delete announcement:', error);
                    showToast('Failed to delete announcement', 'error');
                }
                setShowConfirmModal(false);
            }
        });
        setShowConfirmModal(true);
    };

    const getAnnouncementColor = (type) => {
        switch (type) {
            case 'info':
                return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: <InfoIcon /> };
            case 'warning':
                return { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: <WarningIcon /> };
            case 'success':
                return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: <CheckIcon /> };
            case 'danger':
                return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: <AlertIcon /> };
            default:
                return { bg: '#f3f4f6', border: '#e5e7eb', text: '#374151', icon: <InfoIcon /> };
        }
    };

    if (loading) {
        return (
            <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <LoadingSkeleton type="text" count={1} height={60} width={400} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
                        <LoadingSkeleton type="card" count={1} height={400} />
                        <LoadingSkeleton type="card" count={1} height={400} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem', fontFamily: "'Outfit', sans-serif" }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '4rem',
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
                                Site Management
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px' }}>
                                Customize homepage banners, announcements, and visual content.
                            </p>
                        </div>
                        <img
                            src={siteHero}
                            alt="Site Management Illustration"
                            style={{
                                width: '220px',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                        gap: '2rem',
                        animation: 'slideUp 0.5s ease-out'
                    }}>
                        {/* Banners Section */}
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '2rem',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={bannersIcon} alt="Banners" style={{ width: '48px', height: 'auto', objectFit: 'contain' }} />
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: '700' }}>
                                            Homepage Banners
                                        </h2>
                                        <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                                            {banners.length} Active Banners
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openBannerModal()}
                                    style={{
                                        padding: '0.75rem 1.25rem',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <PlusIcon /> Add New
                                </button>
                            </div>

                            {/* Banners List */}
                            <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                                {banners.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 2rem', opacity: 0.6 }}>
                                        <img src={bannersIcon} alt="Empty" style={{ width: '100px', height: 'auto', marginBottom: '1rem', opacity: 0.5 }} />
                                        <h3 style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>No banners configured</h3>
                                        <p style={{ color: '#cbd5e1', margin: 0 }}>Add a banner to feature content on the homepage.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {banners.map(banner => (
                                            <div
                                                key={banner.id}
                                                style={{
                                                    padding: '1rem',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '16px',
                                                    display: 'flex',
                                                    gap: '1.25rem',
                                                    alignItems: 'center',
                                                    background: banner.is_active ? 'white' : '#f1f5f9',
                                                    opacity: banner.is_active ? 1 : 0.7
                                                }}
                                            >
                                                {/* Banner Image */}
                                                <div style={{
                                                    width: '100px',
                                                    height: '60px',
                                                    background: '#e2e8f0',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    flexShrink: 0
                                                }}>
                                                    {banner.image_path && (
                                                        <img
                                                            src={banner.image_path}
                                                            alt={banner.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </div>

                                                {/* Banner Info */}
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>
                                                        {banner.title}
                                                    </h4>
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '0.2rem 0.6rem',
                                                            borderRadius: '99px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            background: banner.is_active ? '#dcfce7' : '#e2e8f0',
                                                            color: banner.is_active ? '#166534' : '#64748b'
                                                        }}>
                                                            {banner.is_active ? 'Active' : 'Hidden'}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                                            #{banner.display_order}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => toggleBannerStatus(banner)}
                                                        title={banner.is_active ? 'Deactivate' : 'Activate'}
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: banner.is_active ? '#fffbeb' : '#f0fdf4',
                                                            color: banner.is_active ? '#d97706' : '#16a34a',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {banner.is_active ? <PauseIcon /> : <PlayIcon />}
                                                    </button>
                                                    <button
                                                        onClick={() => openBannerModal(banner)}
                                                        title="Edit"
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: '#eff6ff',
                                                            color: '#2563eb',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBanner(banner)}
                                                        title="Delete"
                                                        style={{
                                                            padding: '0.5rem',
                                                            background: '#fef2f2',
                                                            color: '#dc2626',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Announcements Section */}
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            {/* Header */}
                            <div style={{
                                padding: '2rem',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img src={announcementsIcon} alt="Announcements" style={{ width: '48px', height: 'auto', objectFit: 'contain' }} />
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: '700' }}>
                                            Announcements
                                        </h2>
                                        <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>
                                            {announcements.length} Public Posts
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => openAnnouncementModal()}
                                    style={{
                                        padding: '0.75rem 1.25rem',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <PlusIcon /> Post
                                </button>
                            </div>

                            {/* Announcements List */}
                            <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                                {announcements.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 2rem', opacity: 0.6 }}>
                                        <img src={announcementsIcon} alt="Empty" style={{ width: '100px', height: 'auto', marginBottom: '1rem', opacity: 0.5 }} />
                                        <h3 style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>No announcements</h3>
                                        <p style={{ color: '#cbd5e1', margin: 0 }}>Keep your users informed with updates.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {announcements.map(announcement => {
                                            const colors = getAnnouncementColor(announcement.type);
                                            return (
                                                <div
                                                    key={announcement.id}
                                                    style={{
                                                        padding: '1.25rem',
                                                        borderRadius: '16px',
                                                        background: colors.bg,
                                                        border: `1px solid ${colors.border}`
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                <span style={{ fontSize: '1.2rem' }}>{colors.icon}</span>
                                                                <h4 style={{ margin: 0, fontSize: '1rem', color: colors.text, fontWeight: '700' }}>
                                                                    {announcement.title}
                                                                </h4>
                                                            </div>
                                                            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                                                                {announcement.content}
                                                            </p>
                                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={() => openAnnouncementModal(announcement)}
                                                                style={{
                                                                    padding: '0.4rem',
                                                                    background: 'white',
                                                                    color: '#3b82f6',
                                                                    border: '1px solid #e2e8f0',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9rem'
                                                                }}
                                                                title="Edit"
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAnnouncement(announcement)}
                                                                style={{
                                                                    padding: '0.4rem',
                                                                    background: 'white',
                                                                    color: '#ef4444',
                                                                    border: '1px solid #e2e8f0',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.9rem'
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Modal */}
            <Modal
                isOpen={showBannerModal}
                onClose={() => setShowBannerModal(false)}
                title={editingBanner ? 'Edit Banner' : 'Create Banner'}
                size="lg"
            >
                <form onSubmit={handleBannerSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={bannerForm.title}
                            onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                            placeholder="e.g., Summer Sale"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={bannerForm.subtitle}
                            onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                            placeholder="Optional"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Banner Image
                        </label>
                        {/* Tab Toggle for Source */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setBannerForm(prev => ({ ...prev, imageSource: 'asset' }))}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    background: bannerForm.imageSource !== 'upload' ? '#e2e8f0' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#475569'
                                }}
                            >
                                Select from Assets
                            </button>
                            <button
                                type="button"
                                onClick={() => setBannerForm(prev => ({ ...prev, imageSource: 'upload' }))}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    background: bannerForm.imageSource === 'upload' ? '#e2e8f0' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: '#475569'
                                }}
                            >
                                Upload New
                            </button>
                        </div>

                        {bannerForm.imageSource === 'upload' ? (
                            <ImageUploader
                                currentImage={bannerForm.image_path}
                                onImageSelect={(path) => setBannerForm({ ...bannerForm, image_path: path })}
                            />
                        ) : (
                            <AssetPicker
                                selectedPath={bannerForm.image_path}
                                onSelect={(path) => setBannerForm({ ...bannerForm, image_path: path })}
                            />
                        )}

                        {/* Preview if manually entered or prop update */}
                        <div style={{ marginTop: '0.5rem' }}>
                            <input
                                type="text"
                                value={bannerForm.image_path}
                                onChange={(e) => setBannerForm({ ...bannerForm, image_path: e.target.value })}
                                placeholder="Or enter URL manually..."
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.9rem',
                                    color: '#94a3b8'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                                Link URL
                            </label>
                            <input
                                type="text"
                                value={bannerForm.link_url}
                                onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                                placeholder="/products/sale"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                                Sort Order
                            </label>
                            <input
                                type="number"
                                value={bannerForm.display_order}
                                onChange={(e) => setBannerForm({ ...bannerForm, display_order: parseInt(e.target.value) })}
                                min="0"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => setShowBannerModal(false)}
                            style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            {editingBanner ? 'Save Changes' : 'Create Banner'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Announcement Modal */}
            <Modal
                isOpen={showAnnouncementModal}
                onClose={() => setShowAnnouncementModal(false)}
                title={editingAnnouncement ? 'Edit Announcement' : 'Post Announcement'}
                size="md"
            >
                <form onSubmit={handleAnnouncementSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                            placeholder="Important Update"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Content
                        </label>
                        <textarea
                            required
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                            placeholder="Details..."
                            rows={4}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Type
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['info', 'success', 'warning', 'danger'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setAnnouncementForm({ ...announcementForm, type })}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: announcementForm.type === type ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                        background: announcementForm.type === type ? '#eff6ff' : 'white',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        fontWeight: announcementForm.type === type ? '600' : '400'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => setShowAnnouncementModal(false)}
                            style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}
                        >
                            Post
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal */}
            {confirmAction && (
                <Modal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title={confirmAction.title}
                    size="sm"
                    footer={
                        <>
                            <button
                                onClick={() => setShowConfirmModal(false)}
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
                                onClick={confirmAction.onConfirm}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Delete
                            </button>
                        </>
                    }
                >
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{confirmAction.icon}</div>
                        <p style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, fontWeight: '600' }}>
                            {confirmAction.message}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>
                            This action cannot be undone.
                        </p>
                    </div>
                </Modal>
            )}

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}

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

export default AdminSite;
