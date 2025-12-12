import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store
 * Manages user authentication state, token, and user profile
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // Set user and token after login/register
            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: true
            }),

            // Update user profile
            updateUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            })),

            // Logout and clear auth state
            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
