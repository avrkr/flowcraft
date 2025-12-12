import api from './api';

/**
 * AI Service
 * Handles all AI-related API calls
 */

export const aiService = {
    /**
     * Check AI service status
     */
    checkStatus: async () => {
        return await api.get('/ai/status');
    },

    /**
     * Generate flow from text description
     */
    generateFlow: async (description, flowType = 'workflow', saveToDb = true) => {
        return await api.post('/ai/generate-flow', {
            description,
            flowType,
            saveToDb
        });
    },

    /**
     * Generate wireframe from description
     */
    generateWireframe: async (description, saveToDb = true) => {
        return await api.post('/ai/generate-wireframe', {
            description,
            saveToDb
        });
    },

    /**
     * Get suggestions for flow improvement
     */
    getSuggestions: async (flowId) => {
        return await api.post('/ai/suggest-improvements', {
            flowId
        });
    },

    /**
     * Optimize flow layout
     */
    optimizeLayout: async (flowId) => {
        return await api.post('/ai/optimize-layout', {
            flowId
        });
    },

    /**
     * Generate multi-page wireframe prototype
     */
    generateMultiPageWireframe: async (description, saveToDb = true) => {
        return await api.post('/ai/generate-multipage-wireframe', {
            description,
            saveToDb
        });
    }
};
