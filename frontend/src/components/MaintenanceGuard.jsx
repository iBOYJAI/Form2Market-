import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import MaintenanceMode from './MaintenanceMode';

const MaintenanceGuard = ({ children }) => {
    const { settings, loading } = useSettings();
    const { isAdmin, loading: authLoading } = useAuth();

    if (loading || authLoading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    // specific check: if maintenance mode is on AND user is NOT an admin
    // Note: isAdmin() might require the user to be logged in. 
    // If not logged in, isAdmin() should return false.
    // CRITICAL FIX: Allow access to /login so admins can actually log in!
    if (settings.maintenance_mode && !isAdmin() && window.location.pathname !== '/login') {
        return <MaintenanceMode />;
    }

    return children;
};

export default MaintenanceGuard;
