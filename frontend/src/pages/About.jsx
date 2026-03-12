import React from 'react';
import { Link } from 'react-router-dom';

// Assets
import HeroImage from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Example Scenes/PNG/example-scene-2.png';
import MissionImg from '../assets/images/0088-nature-ecology-illustrations/DrawKit Vector Illustration Ecology & Environment/PNG/DrawKit Vector Illustration Ecology & Environment (10).png';
import StoryImg from '../assets/images/0073-teamwork-illustrations/DrawKit Vector Illustration Team Work/PNG/DrawKit Vector Illustration Team Work (9).png';
import PlantIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Scene Elements/PNG/plant-2.png';
import IntegrityIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Scene Elements/PNG/box.png';
import CommunityIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Scene Elements/PNG/tree-3.png';

const About = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero" style={{ padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                                Cultivating Connection
                                <span className="text-gradient" style={{ display: 'block', fontSize: '0.6em', marginTop: '0.5rem' }}>Farmers. Families. Future.</span>
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Form2Market is more than just a marketplace. It's a movement to bring fresh, local produce back to the center of our communities, ensuring fair trade for farmers and healthy food for everyone.
                            </p>
                            <Link to="/contact" className="btn btn-primary btn-large">
                                Get in Touch
                            </Link>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={HeroImage} alt="About Us Hero" style={{ width: '100%', maxWidth: '550px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap-reverse' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={MissionImg} alt="Our Mission" style={{ width: '100%', maxWidth: '500px' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Our Mission</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                To empower local farmers by providing them with a direct-to-consumer platform that eliminates middlemen, ensuring they receive the fair value of their hard work while providing communities with access to the freshest produce.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                                    <span style={{ color: 'var(--primary-color)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span>
                                    Fair Pricing for Farmers
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                                    <span style={{ color: 'var(--primary-color)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span>
                                    Freshness Guaranteed
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                                    <span style={{ color: 'var(--primary-color)', marginRight: '10px', fontSize: '1.5rem' }}>✓</span>
                                    Community Driven
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="section" style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Our Story</h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                Founded in Tamil Nadu, Form2Market started as a simple idea: what if you could buy your vegetables directly from the person who grew them?
                            </p>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                We saw farmers struggling with low market prices and consumers paying high rates for week-old produce. We decided to build a bridge. Today, we connect thousands of farmers across the state directly with households, restaurants, and local businesses.
                            </p>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img src={StoryImg} alt="Our Team" style={{ width: '100%', maxWidth: '500px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            {/* Values Grid */}
            <section className="features-section" style={{ background: 'linear-gradient(to bottom, var(--bg-surface), white)', padding: '6rem 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.8rem', color: 'var(--primary-dark)' }}>Core Values</h2>
                    <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>

                        {/* Card 1: Sustainability */}
                        <div className="feature-card"
                            style={{
                                padding: '2.5rem',
                                background: 'white',
                                borderRadius: '20px',
                                textAlign: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.03)',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div className="feature-icon" style={{ height: '90px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={PlantIcon} alt="Sustainability" style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Sustainability</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Promoting eco-friendly farming practices and reducing carbon footprints to protect our planet.</p>
                        </div>

                        {/* Card 2: Integrity */}
                        <div className="feature-card"
                            style={{
                                padding: '2.5rem',
                                background: 'white',
                                borderRadius: '20px',
                                textAlign: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.03)',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div className="feature-icon" style={{ height: '90px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={IntegrityIcon} alt="Integrity" style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Integrity</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Ensuring transparent transactions and building honest, long-lasting relationships with our community.</p>
                        </div>

                        {/* Card 3: Community */}
                        <div className="feature-card"
                            style={{
                                padding: '2.5rem',
                                background: 'white',
                                borderRadius: '20px',
                                textAlign: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.03)',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div className="feature-icon" style={{ height: '90px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={CommunityIcon} alt="Community" style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>Community</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Building a stronger, healthier society by directly connecting neighbors and supporting local.</p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
