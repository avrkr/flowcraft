import StartNode from './StartNode';
import ActionNode from './ActionNode';
import DecisionNode from './DecisionNode';
import APINode from './APINode';
import EndNode from './EndNode';
import PageNode from './PageNode';

/**
 * Node type configuration for React Flow
 * Maps node types to their respective components
 */
export const nodeTypes = {
    start: StartNode,
    action: ActionNode,
    decision: DecisionNode,
    api: APINode,
    end: EndNode,
    page: PageNode,
};

/**
 * Default node configurations
 * Used when creating new nodes
 */
export const defaultNodeConfig = {
    start: {
        type: 'start',
        data: {
            label: 'Start',
            color: '#10b981',
        },
        style: {
            width: 150,
            height: 60,
        },
    },
    action: {
        type: 'action',
        data: {
            label: 'Action',
            description: '',
            color: '#3b82f6',
        },
        style: {
            width: 180,
            height: 80,
        },
    },
    decision: {
        type: 'decision',
        data: {
            label: 'Decision',
        },
        style: {
            width: 140,
            height: 140,
        },
    },
    api: {
        type: 'api',
        data: {
            label: 'API Call',
            description: '',
            metadata: {
                endpoint: '',
                method: 'GET',
            },
        },
        style: {
            width: 180,
            height: 90,
        },
    },
    end: {
        type: 'end',
        data: {
            label: 'End',
            color: '#ef4444',
        },
        style: {
            width: 120,
            height: 60,
        },
    },
};
