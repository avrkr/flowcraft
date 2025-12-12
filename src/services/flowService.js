import api from './api';

/**
 * Flow Service
 * Handles all flow-related API calls
 */

export const flowService = {
    /**
     * Get all flows with optional filters
     */
    getFlows: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/flows${queryString ? `?${queryString}` : ''}`);
    },

    /**
     * Get single flow by ID
     */
    getFlow: async (flowId) => {
        return await api.get(`/flows/${flowId}`);
    },

    /**
     * Create new flow
     */
    createFlow: async (flowData) => {
        return await api.post('/flows', flowData);
    },

    /**
     * Update flow
     */
    updateFlow: async (flowId, flowData) => {
        return await api.put(`/flows/${flowId}`, flowData);
    },

    /**
     * Delete flow
     */
    deleteFlow: async (flowId) => {
        return await api.delete(`/flows/${flowId}`);
    },

    /**
     * Validate flow
     */
    validateFlow: async (flowId) => {
        return await api.get(`/flows/${flowId}/validate`);
    },

    /**
     * Export flow as JSON
     */
    exportFlow: async (flowId) => {
        return await api.get(`/flows/${flowId}/export`);
    },

    /**
     * Import flow from JSON
     */
    importFlow: async (flowData) => {
        return await api.post('/flows/import', flowData);
    },

    /**
     * Get flow versions
     */
    getFlowVersions: async (flowId) => {
        return await api.get(`/flows/${flowId}/versions`);
    },

    /**
     * Restore flow to specific version
     */
    restoreFlowVersion: async (flowId, versionNumber) => {
        return await api.post(`/flows/${flowId}/restore/${versionNumber}`);
    },

    /**
     * Duplicate flow
     */
    duplicateFlow: async (flowId) => {
        return await api.post(`/flows/${flowId}/duplicate`);
    }
};
