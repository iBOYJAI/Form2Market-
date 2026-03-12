import React, { useState } from 'react';
import axios from 'axios';

// Assets
import ContactHeroImg from '../assets/images/0126-phonies-illustrations/Phonies by DrawKit Vector Illustrations/PNG/Call waiting_DrawKit_Vector_Illustrations.png';
import LocationIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Scene Elements/PNG/hills.png';
import EmailIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/UI Elements/PNG/email-notification.png';
import PhoneIcon from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/UI Elements/PNG/mobile-ui-1.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // success | error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero" style={{ padding: '4rem 0', background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="hero-content" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>We'd Love to Hear From You</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                Whether you have a question about pricing, features, or just want to say hello, our team is ready to answer all your questions.
                            </p>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
                            <img src={ContactHeroImg} alt="Contact Support" style={{ width: '100%', maxWidth: '400px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '4rem 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                    {/* Contact Info Column */}
                    <div>
                        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>Contact Information</h2>
                        <div className="inquiry-list" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>

                            {/* Address Card */}
                            <div className="feature-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ width: '60px', marginRight: '1.5rem', flexShrink: 0 }}>
                                    <img src={LocationIcon} alt="Location" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Visit Us</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Gobi Arts & Science College, Gobi</p>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="feature-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ width: '60px', marginRight: '1.5rem', flexShrink: 0 }}>
                                    <img src={EmailIcon} alt="Email" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Email Us</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>support@form2market.com</p>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="feature-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '15px', boxShadow: 'var(--shadow-md)' }}>
                                <div style={{ width: '60px', marginRight: '1.5rem', flexShrink: 0 }}>
                                    <img src={PhoneIcon} alt="Phone" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Call Us</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>+91 98765 43210</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="form-card" style={{ padding: '2.5rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', background: 'white' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Send a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                    style={{ background: 'var(--bg-surface)', border: '1px solid transparent' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                    style={{ background: 'var(--bg-surface)', border: '1px solid transparent' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Subject</label>
                                <select
                                    name="subject"
                                    className="form-input"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    style={{ background: 'var(--bg-surface)', border: '1px solid transparent' }}
                                >
                                    <option value="">Select a subject</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Partnership">Partnership</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '600' }}>Message</label>
                                <textarea
                                    name="message"
                                    className="form-input"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    required
                                    style={{ background: 'var(--bg-surface)', border: '1px solid transparent' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Send Message</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
