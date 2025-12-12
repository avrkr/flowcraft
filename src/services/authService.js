import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
    /**
     * Register a new user
     */
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        return await api.post('/auth/login', credentials);
    },

    /**
     * Get current user profile
     */
    getMe: async () => {
        return await api.get('/auth/me');
    },

    /**
     * Update user profile
     */
    updateProfile: async (userData) => {
        return await api.put('/auth/profile', userData);
    },

    /**
     * Update password
     */
    updatePassword: async (passwordData) => {
        return await api.put('/auth/password', passwordData);
    }
};
