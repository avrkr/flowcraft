import { create } from 'zustand';

/**
 * UI Store
 * Manages global UI state like theme, modals, sidebar, etc.
 */
export const useUIStore = create((set) => ({
    // Theme
    theme: localStorage.getItem('theme') || 'light',

    // Sidebar
    isSidebarOpen: true,

    // Modals
    isCreateFlowModalOpen: false,
    isImportModalOpen: false,
    isExportModalOpen: false,
    isSettingsModalOpen: false,

    // Panels
    isPropertiesPanelOpen: true,
    isVersionPanelOpen: false,

    // Loading states
    isLoading: false,
    loadingMessage: '',

    // Toggle theme
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);

        // Update document class
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        return { theme: newTheme };
    }),

    // Set theme
    setTheme: (theme) => set(() => {
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        return { theme };
    }),

    // Toggle sidebar
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    // Toggle properties panel
    togglePropertiesPanel: () => set((state) => ({
        isPropertiesPanelOpen: !state.isPropertiesPanelOpen
    })),

    // Toggle version panel
    toggleVersionPanel: () => set((state) => ({
        isVersionPanelOpen: !state.isVersionPanelOpen
    })),

    // Modal controls
    openCreateFlowModal: () => set({ isCreateFlowModalOpen: true }),
    closeCreateFlowModal: () => set({ isCreateFlowModalOpen: false }),

    openImportModal: () => set({ isImportModalOpen: true }),
    closeImportModal: () => set({ isImportModalOpen: false }),

    openExportModal: () => set({ isExportModalOpen: true }),
    closeExportModal: () => set({ isExportModalOpen: false }),

    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),

    // Loading controls
    setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),
}));

// Initialize theme on app load
const storedTheme = localStorage.getItem('theme') || 'light';
if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
}
