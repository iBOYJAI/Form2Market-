/**
 * API Service
 * Axios configuration and API methods for Form2Market
 */

import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me')
};

// Product API
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getFarmerProducts: () => api.get('/products/farmer/my-products'),
    getFeatured: () => api.get('/products/featured/list'),
    create: (formData) => api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/products/${id}`),
    getCategories: () => api.get('/products/categories/list')
};

// User API (Admin)
// User API (Admin)
export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    updateStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
    delete: (id) => api.delete(`/users/${id}`),
    getStats: () => api.get('/users/stats/summary')
};

// Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact', data),
    getAll: (params) => api.get('/contact', { params }),
    archive: (id) => api.put(`/contact/${id}/archive`),
    restore: (id) => api.put(`/contact/${id}/restore`),
    delete: (id) => api.delete(`/contact/${id}`)
};

// Inquiry API
export const inquiryAPI = {
    create: (data) => api.post('/inquiries', data),
    getFarmerInquiries: () => api.get('/inquiries/farmer'),
    getBuyerInquiries: () => api.get('/inquiries/buyer'),
    getProductInquiries: (productId) => api.get(`/inquiries/product/${productId}`),
    delete: (id) => api.delete(`/inquiries/${id}`),
    // Chat methods
    reply: (id, data) => api.post(`/inquiries/${id}/reply`, data),
    getMessages: (id) => api.get(`/inquiries/${id}/messages`)
};

// Notification API
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all')
};

// Logistics API
export const logisticsAPI = {
    createJob: (data) => api.post('/logistics/jobs', data),
    getMyJobs: () => api.get('/logistics/my-jobs'),
    getOpenJobs: () => api.get('/logistics/jobs/open'),
    acceptJob: (id) => api.put(`/logistics/jobs/${id}/accept`)
};

// Admin API
export const adminAPI = {
    // Settings
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.put('/admin/settings', data),

    // Site Content - Banners
    getBanners: () => api.get('/content/banners'),
    createBanner: (data) => api.post('/content/banners', data),
    updateBanner: (id, data) => api.put(`/content/banners/${id}`, data),
    deleteBanner: (id) => api.delete(`/content/banners/${id}`),

    // Site Content - Announcements
    getAnnouncements: () => api.get('/content/announcements'),
    createAnnouncement: (data) => api.post('/content/announcements', data),
    updateAnnouncement: (id, data) => api.put(`/content/announcements/${id}`, data),
    deleteAnnouncement: (id) => api.delete(`/content/announcements/${id}`),

    // Product Management
    approveProduct: (id) => api.put(`/admin/products/${id}/approve`),
    rejectProduct: (id, reason) => api.put(`/admin/products/${id}/reject`, { reason }),
    toggleFeatured: (id) => api.put(`/admin/products/${id}/featured`),

    // Statistics
    getStatistics: () => api.get('/admin/statistics')
};

// Settings API (Public)
export const settingsAPI = {
    getPublic: () => api.get('/settings/public')
};

// Site Content API (Public)
export const contentAPI = {
    getBanners: () => api.get('/content/banners/public'),
    getAnnouncements: () => api.get('/content/announcements/public'),
};

// Profile API
export const profileAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data) => api.put('/profile', data),

    // Addresses (Buyers)
    getAddresses: () => api.get('/profile/addresses'),
    addAddress: (data) => api.post('/profile/addresses', data),
    updateAddress: (id, data) => api.put(`/profile/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/profile/addresses/${id}`),

    // Deliveries (Transporters)
    getDeliveries: (params) => api.get('/profile/deliveries', { params }),
    updateDeliveryStatus: (id, data) => api.put(`/profile/deliveries/${id}`, data)
};

export default api;
