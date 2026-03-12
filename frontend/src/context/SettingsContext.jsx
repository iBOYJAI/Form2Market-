/**
 * Settings Context
 * Global state management for platform settings (Site Name, etc.)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        site_name: 'Form2Market', // Default fallback
        platform_fee: 5,
        support_email: 'support@form2market.com',
        enable_registration: true,
        maintenance_mode: false
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await settingsAPI.getPublic();
            if (response.data.success) {
                setSettings(prev => ({ ...prev, ...response.data.settings }));
            }
        } catch (error) {
            console.error('Failed to fetch global settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const refreshSettings = () => {
        fetchSettings();
    };

    const value = {
        settings,
        loading,
        refreshSettings
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
