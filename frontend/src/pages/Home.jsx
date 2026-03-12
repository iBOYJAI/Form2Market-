/**
 * Home Page
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contentAPI } from '../services/api';
import { getAssetUrl } from '../utils/assetRegistry';

// Assets
import HeroImage from '../assets/images/0026-cooking-food-illustrations/DrawKit-cooking-kitchen-food-vector-illustration/PNG/DrawKit-cooking-kitchen-food-vector-illustrations-01.png';
import FarmerIcon from '../assets/images/0011-ecology-environment-illustrations/DrawKit - Ecology _ Nature Illustration Pack/PNG/Asset 5.png';
import BuyerIcon from '../assets/images/0027-online-shopping-illustrations/DrawKit-Vector-Illustration-online-shopping/PNG/DrawKit-Vector-Illustration-ecommerce-01.png';
import OfflineIcon from '../assets/images/0011-ecology-environment-illustrations/DrawKit - Ecology _ Nature Illustration Pack/PNG/Asset 8.png';
import NoFeeIcon from '../assets/images/0073-teamwork-illustrations/DrawKit Vector Illustration Team Work/PNG/DrawKit Vector Illustration Team Work (1).png';

// New Section Assets
import FarmerStepImg from '../assets/images/0010-people-working-illustrations/DrawKit - People Working Illustration Pack/PNG/character 22.png';
import BuyerStepImg from '../assets/images/0010-people-working-illustrations/DrawKit - People Working Illustration Pack/PNG/character 18.png';
import CommunityImg from '../assets/images/0088-nature-ecology-illustrations/DrawKit Vector Illustration Ecology & Environment/PNG/DrawKit Vector Illustration Ecology & Environment (1).png';
import DeliveryImg from '../assets/images/0009-transport-illustration-pack/DrawKit - Transport Illustration Pack/PNG/drawkit-transport-scene-1.png';
import Avatar1 from '../assets/images/Avatar/boy-1.png';
import Avatar2 from '../assets/images/Avatar/girl-2.png';
import Avatar3 from '../assets/images/Avatar/boy-5.png';

const Home = () => {
    const { user, isFarmer, isBuyer, isAdmin } = useAuth();
    const [banners, setBanners] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (isFarmer()) return '/farmer/dashboard';
        if (isBuyer()) return '/buyer/dashboard';
        if (isAdmin()) return '/admin/dashboard';
        return '/';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bannersRes, announcementsRes] = await Promise.all([
                    contentAPI.getBanners(),
                    contentAPI.getAnnouncements()
                ]);
                if (bannersRes.data.success) setBanners(bannersRes.data.banners);
                if (announcementsRes.data.success) setAnnouncements(announcementsRes.data.announcements);
            } catch (error) {
                console.error('Failed to load home content:', error);
            }
        };
        fetchData();
    }, []);

    // Banner Autoplay
    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    return (
        <div className="home-container" style={{ paddingBottom: 0 }}>
            {/* Announcements Ticker */}
            {announcements.length > 0 && (
                <div style={{ background: 'linear-gradient(90deg, #1e293b, #0f172a)', color: 'white', padding: '0.8rem 0', position: 'relative', overflow: 'hidden', marginTop: '70px' }}>
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', animation: 'fadeIn 0.5s' }}>
                            <span style={{
                                background: '#ef4444',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                New
                            </span>
                            <div style={{ display: 'flex', gap: '2rem', overflow: 'hidden' }}>
                                {announcements.map((ann, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                                        <span style={{ opacity: 0.8 }}>📢</span>
                                        <strong style={{ color: '#e2e8f0' }}>{ann.title}:</strong>
                                        <span style={{ opacity: 0.9 }}>{ann.content}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Banner Section - Redesigned */}
            {banners.length > 0 ? (
                <div style={{
                    position: 'relative',
                    height: '600px',
                    overflow: 'hidden',
                    background: '#0f172a'
                }}>
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: index === currentBanner ? 1 : 0,
                                transform: index === currentBanner ? 'scale(1)' : 'scale(1.05)',
                                transition: 'all 1.2s ease-in-out',
                                zIndex: index === currentBanner ? 1 : 0
                            }}
                        >
                            {/* Background Image */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${getAssetUrl(banner.image_path)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'brightness(0.6)'
                            }} />

                            {/* Content Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3))'
                            }}>
                                <div className="container" style={{ maxWidth: '1200px', width: '100%', padding: '0 2rem' }}>
                                    <div style={{ maxWidth: '600px', transform: index === currentBanner ? 'translateY(0)' : 'translateY(30px)', opacity: index === currentBanner ? 1 : 0, transition: 'all 0.8s ease-out 0.3s' }}>
                                        <h1 style={{
                                            fontSize: '4rem',
                                            fontWeight: '800',
                                            color: 'white',
                                            marginBottom: '1.5rem',
                                            lineHeight: 1.1,
                                            letterSpacing: '-2px',
                                            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                        }}>
                                            {banner.title}
                                        </h1>
                                        {banner.subtitle && (
                                            <p style={{
                                                fontSize: '1.5rem',
                                                color: '#e2e8f0',
                                                marginBottom: '2.5rem',
                                                lineHeight: 1.6,
                                                opacity: 0.9,
                                                borderLeft: '4px solid #3b82f6',
                                                paddingLeft: '1.5rem'
                                            }}>
                                                {banner.subtitle}
                                            </p>
                                        )}
                                        {banner.link_url && (
                                            <Link
                                                to={banner.link_url}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    background: 'white',
                                                    color: '#0f172a',
                                                    padding: '1rem 2.5rem',
                                                    borderRadius: '50px',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '700',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; }}
                                            >
                                                Explore Now
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Progress Indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '0',
                        width: '100%',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.8rem'
                    }}>
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentBanner(index)}
                                style={{
                                    width: index === currentBanner ? '40px' : '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    background: index === currentBanner ? 'white' : 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    padding: 0
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                /* Fallback Static Hero if no banners */
                <div className="hero">
                    <div className="container">
                        <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
                                <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                                    Farm to Market
                                    <span className="text-gradient" style={{ display: 'block', fontSize: '0.6em', marginTop: '0.5rem' }}>Direct. Fresh. Local.</span>
                                </h1>
                                <p className="hero-description" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                    The premium offline marketplace connecting local farmers directly with buyers.
                                    No middlemen, just fair prices and fresh produce.
                                </p>

                                {user ? (
                                    <Link to={getDashboardLink()} className="btn btn-primary btn-large">
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <div className="hero-buttons" style={{ justifyContent: 'flex-start' }}>
                                        <Link to="/register" className="btn btn-primary btn-large">
                                            Get Started
                                        </Link>
                                        <Link to="/login" className="btn btn-secondary btn-large">
                                            Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <img src={HeroImage} alt="Farm Scene" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
                            </div>
                        </div>

                        <div className="hero-stats" style={{ marginTop: '4rem' }}>
                            <div className="stat-item">
                                <h3>100%</h3>
                                <p>Fresh Produce</p>
                            </div>
                            <div className="stat-item">
                                <h3>0%</h3>
                                <p>Commission</p>
                            </div>
                            <div className="stat-item">
                                <h3>24/7</h3>
                                <p>Availability</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* How It Works Section */}
            <div className="section" style={{ padding: '4rem 0', background: 'var(--bg-surface)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: 'var(--primary-dark)' }}>How It Works</h2>

                    <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        {/* Step 1: Farmers */}
                        <div className="feature-card" style={{ textAlign: 'center' }}>
                            <img src={FarmerStepImg} alt="Farmer" style={{ height: '200px', marginBottom: '1rem', objectFit: 'contain' }} />
                            <h3>1. Farmers List Produce</h3>
                            <p>Local farmers upload their available harvest, set their own prices, and manage inventory directly.</p>
                        </div>

                        {/* Step 2: Buyers */}
                        <div className="feature-card" style={{ textAlign: 'center' }}>
                            <img src={BuyerStepImg} alt="Buyer" style={{ height: '200px', marginBottom: '1rem', objectFit: 'contain' }} />
                            <h3>2. Buyers Connect</h3>
                            <p>Consumers navigate the marketplace, find fresh local goods, and connect directly with the source.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features">
                <div className="container">
                    <h2>Why Choose Form2Market?</h2>
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: '100px', borderRadius: '0' }}>
                                <img src={FarmerIcon} alt="Farmer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h3>For Farmers</h3>
                            <p>List your products easily, manage inventory, and connect directly with buyers.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: '100px', borderRadius: '0' }}>
                                <img src={BuyerIcon} alt="Buyer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h3>For Buyers</h3>
                            <p>Browse fresh products, filter by category, and contact farmers directly.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: '100px', borderRadius: '0' }}>
                                <img src={OfflineIcon} alt="Offline" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h3>100% Offline</h3>
                            <p>Works completely offline on your local network. No internet required!</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'transparent', width: 'auto', height: '100px', borderRadius: '0' }}>
                                <img src={NoFeeIcon} alt="No Fees" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h3>No Middlemen</h3>
                            <p>Direct farmer-to-buyer transactions ensure better prices for both parties.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Community & Impact Section */}
            <div className="section" style={{ padding: '4rem 0', background: 'var(--bg-body)' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap-reverse', flexDirection: 'row-reverse' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Cultivating a Sustainable Future</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                By supporting local agriculture, we reduce carbon footprints associated with long-distance food transport.
                                Form2Market empowers communities to be self-sufficient and environmentally conscious.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>🌱 <span style={{ marginLeft: '10px' }}>Reduced Food Miles</span></li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>💧 <span style={{ marginLeft: '10px' }}>Support Local Water Conservation</span></li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>🤝 <span style={{ marginLeft: '10px' }}>Stronger Community Bonds</span></li>
                            </ul>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={CommunityImg} alt="Community" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="section" style={{ padding: '4rem 0', background: 'var(--bg-surface)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>What Our Community Says</h2>
                    <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={Avatar1} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Muthuvel</h4>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Farmer, Theni</span>
                                </div>
                            </div>
                            <p>"Selling my organic turmeric directly from my farm has never been easier. I get the best price for my hard work."</p>
                        </div>
                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={Avatar2} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Lakshmi</h4>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Home Maker, Chennai</span>
                                </div>
                            </div>
                            <p>"I order fresh vegetables weekly for my family. The quality of greens from local farmers is unmatched."</p>
                        </div>
                        <div className="feature-card" style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <img src={Avatar3} alt="User" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>Karthik</h4>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Restaurant Owner, Coimbatore</span>
                                </div>
                            </div>
                            <p>"Sourcing bulk onions and potatoes directly from farmers saves me money and ensures fresh stock for my restaurant."</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="section" style={{ padding: '6rem 0', background: 'var(--gradient-primary)', color: 'white', marginTop: '2rem' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={DeliveryImg} alt="Join Us" style={{ width: '100%', maxWidth: '500px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Ready to Join the Revolution?</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: '0.9' }}>
                                Whether you're growing fresh produce or looking for the best local ingredients, there's a place for you here.
                            </p>
                            <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: '600' }}>
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
