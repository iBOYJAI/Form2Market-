import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Assets
import LoginHero from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Example Scenes/PNG/example-scene-3.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, isFarmer, isBuyer, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleQuickAuth = async (email, password) => {
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                const role = result.user?.role;
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'farmer') navigate('/farmer/dashboard');
                else if (role === 'buyer') navigate('/buyer/dashboard');
                else if (role === 'transporter') navigate('/transporter/dashboard');
                else navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                const role = result.user?.role;
                if (role === 'admin') navigate('/admin/dashboard');
                else if (role === 'farmer') navigate('/farmer/dashboard');
                else if (role === 'buyer') navigate('/buyer/dashboard');
                else if (role === 'transporter') navigate('/transporter/dashboard');
                else navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-surface)' }}>

            {/* Left Side - Image & Brand */}
            <div style={{ flex: 1, background: '#eef2f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="d-none d-md-flex">
                <div style={{ zIndex: 2, textAlign: 'center', maxWidth: '500px' }}>
                    <img src={LoginHero} alt="Login Illustration" style={{ width: '100%', maxWidth: '450px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }} />
                    <h2 style={{ marginTop: '2rem', color: 'var(--primary-dark)', fontSize: '2rem' }}>Fresh from the Farm</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Connect directly with local producers and experience the true taste of nature.</p>
                </div>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)', zIndex: 1 }}></div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'white' }}>
                <div style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Welcome Back! 👋</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Login to access your Form2Market account</p>
                    </div>

                    {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '10px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="form-input"
                                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="form-input"
                                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>⚡ Quick Login (Demo Mode):</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <button
                                type="button"
                                onClick={() => handleQuickAuth('admin@farm.com', 'password123')}
                                style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)' }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                                👮 Login as Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickAuth('farmer@farm.com', 'password123')}
                                style={{ padding: '0.75rem', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)' }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                                👨‍🌾 Login as Farmer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickAuth('buyer@farm.com', 'password123')}
                                style={{ padding: '0.75rem', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)' }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                                🛒 Login as Buyer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickAuth('transporter@farm.com', 'password123')}
                                style={{ padding: '0.75rem', background: '#f3e8ff', color: '#9333ea', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)' }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                                🚛 Login as Transporter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Login;
