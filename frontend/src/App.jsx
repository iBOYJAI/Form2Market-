/**
 * Main App Component
 * React Router setup and application structure
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import MaintenanceGuard from './components/MaintenanceGuard';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import AddProduct from './pages/AddProduct';
import FarmerProducts from './pages/FarmerProducts';
import FarmerInquiries from './pages/FarmerInquiries';
import PostTransportJob from './pages/PostTransportJob';
import TransporterDashboard from './pages/TransporterDashboard';
import MyDeliveries from './pages/MyDeliveries';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerInquiries from './pages/BuyerInquiries';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminSettings from './pages/AdminSettings';
import AdminSite from './pages/AdminSite';

function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <Router>
                    <div className="app">
                        <Navbar />
                        <main className="main-content">
                            <MaintenanceGuard>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/products/:id" element={<ProductDetails />} />

                                    {/* Farmer Routes */}
                                    <Route
                                        path="/farmer/dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['farmer']}>
                                                <FarmerDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/farmer/products/add"
                                        element={
                                            <ProtectedRoute allowedRoles={['farmer']}>
                                                <AddProduct />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/farmer/products/edit/:id"
                                        element={
                                            <ProtectedRoute allowedRoles={['farmer']}>
                                                <AddProduct />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/farmer/products"
                                        element={
                                            <ProtectedRoute allowedRoles={['farmer']}>
                                                <FarmerProducts />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/farmer/inquiries"
                                        element={
                                            <ProtectedRoute allowedRoles={['farmer']}>
                                                <FarmerInquiries />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Buyer Routes */}
                                    <Route
                                        path="/buyer/dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['buyer']}>
                                                <BuyerDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/buyer/inquiries"
                                        element={
                                            <ProtectedRoute allowedRoles={['buyer']}>
                                                <BuyerInquiries />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/logistics/post-job"
                                        element={
                                            <ProtectedRoute>
                                                <PostTransportJob />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/logistics/my-jobs"
                                        element={
                                            <ProtectedRoute>
                                                <MyDeliveries />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Admin Routes */}
                                    <Route
                                        path="/admin/dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/messages"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminMessages />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/users"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminUsers />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/products"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminProducts />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/settings"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminSettings />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/site"
                                        element={
                                            <ProtectedRoute allowedRoles={['admin']}>
                                                <AdminSite />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Transporter Routes */}
                                    <Route
                                        path="/transporter/dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['transporter']}>
                                                <TransporterDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/transporter/deliveries"
                                        element={
                                            <ProtectedRoute allowedRoles={['transporter']}>
                                                <MyDeliveries />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* 404 Route */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </MaintenanceGuard>
                        </main>
                    </div>
                </Router>
            </SettingsProvider>
        </AuthProvider>
    );
}

export default App;
