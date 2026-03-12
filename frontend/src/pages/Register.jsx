import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Assets
import RegisterHero from '../assets/images/0001-peach-illustration-system/DrawKit_0001_Peach_Illustrations/Example Scenes/PNG/example-scene-1.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer' // default to buyer
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, isFarmer, isBuyer } = useAuth();
    const { settings, loading: settingsLoading } = useSettings();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const result = await register(registerData);

            if (result.success) {
                if (isFarmer()) navigate('/farmer/dashboard');
                else if (isBuyer()) navigate('/buyer/dashboard');
                else navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    if (settingsLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!settings.enable_registration) {
        return (
            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                <div style={{ margin: 'auto', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                    <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registration Closed</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        New user registration is currently disabled by the administrator.
                        Please check back later or contact support if you need assistance.
                    </p>
                    <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '10px' }}>
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-surface)' }}>

            {/* Left Side - Image & Brand */}
            <div style={{ flex: 1, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }} className="d-none d-md-flex">
                <div style={{ zIndex: 2, textAlign: 'center', maxWidth: '500px' }}>
                    <img src={RegisterHero} alt="Register Illustration" style={{ width: '100%', maxWidth: '450px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }} />
                    <h2 style={{ marginTop: '2rem', color: 'var(--primary-dark)', fontSize: '2rem' }}>Join the Community</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Start your journey with Form2Market today and support sustainable local agriculture.</p>
                </div>
                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)', zIndex: 1 }}></div>
            </div>

            {/* Right Side - Register Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'white' }}>
                <div style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Create Account 🚀</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Sign up to buy or sell fresh produce</p>
                    </div>

                    {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '10px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="form-input"
                                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                            />
                        </div>

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
                            <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>I am a</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="form-input"
                                style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', background: 'white' }}
                            >
                                <option value="buyer">Buyer (I want to buy products)</option>
                                <option value="farmer">Farmer (I want to sell products)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Min 6 chars"
                                    className="form-input"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Confirm</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Re-enter"
                                    className="form-input"
                                    style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Create Account' : 'Register'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
