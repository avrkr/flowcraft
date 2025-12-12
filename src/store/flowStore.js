import { create } from 'zustand';

/**
 * Flow Store
 * Manages the current flow being edited, nodes, edges, and flow operations
 */
export const useFlowStore = create((set, get) => ({
    // Current flow data
    currentFlow: null,
    flows: [],
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },

    // UI state
    selectedNode: null,
    selectedEdge: null,
    isDirty: false,
    lastSaved: null,

    // Active users in collaboration
    activeUsers: [],

    // Set current flow
    setCurrentFlow: (flow) => set({
        currentFlow: flow,
        nodes: flow?.nodes || [],
        edges: flow?.edges || [],
        viewport: flow?.viewport || { x: 0, y: 0, zoom: 1 },
        isDirty: false,
        lastSaved: flow?.updatedAt || null
    }),

    // Update flows list
    setFlows: (flows) => set({ flows }),

    // Update nodes
    setNodes: (nodes) => set({ nodes, isDirty: true }),

    // Update edges
    setEdges: (edges) => set({ edges, isDirty: true }),

    // Update viewport
    setViewport: (viewport) => set({ viewport }),

    // Add node
    addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node],
        isDirty: true
    })),

    // Update node
    updateNode: (nodeId, updates) => set((state) => ({
        nodes: state.nodes.map(node =>
            node.id === nodeId ? { ...node, ...updates } : node
        ),
        isDirty: true
    })),

    // Delete node
    deleteNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter(node => node.id !== nodeId),
        edges: state.edges.filter(edge =>
            edge.source !== nodeId && edge.target !== nodeId
        ),
        selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
        isDirty: true
    })),

    // Add edge
    addEdge: (edge) => set((state) => ({
        edges: [...state.edges, edge],
        isDirty: true
    })),

    // Update edge
    updateEdge: (edgeId, updates) => set((state) => ({
        edges: state.edges.map(edge =>
            edge.id === edgeId ? { ...edge, ...updates } : edge
        ),
        isDirty: true
    })),

    // Delete edge
    deleteEdge: (edgeId) => set((state) => ({
        edges: state.edges.filter(edge => edge.id !== edgeId),
        selectedEdge: state.selectedEdge?.id === edgeId ? null : state.selectedEdge,
        isDirty: true
    })),

    // Set selected node
    selectNode: (node) => set({ selectedNode: node, selectedEdge: null }),

    // Set selected edge
    selectEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),

    // Clear selection
    clearSelection: () => set({ selectedNode: null, selectedEdge: null }),

    // Mark as saved
    markAsSaved: () => set({ isDirty: false, lastSaved: new Date() }),

    // Reset flow
    resetFlow: () => set({
        currentFlow: null,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        selectedNode: null,
        selectedEdge: null,
        isDirty: false,
        lastSaved: null
    }),

    // Set active users (for collaboration)
    setActiveUsers: (users) => set({ activeUsers: users }),

    // Add active user
    addActiveUser: (user) => set((state) => ({
        activeUsers: [...state.activeUsers, user]
    })),

    // Remove active user
    removeActiveUser: (userId) => set((state) => ({
        activeUsers: state.activeUsers.filter(u => u.id !== userId)
    })),
}));
