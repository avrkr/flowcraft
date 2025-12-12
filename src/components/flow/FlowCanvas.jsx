import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '@/store/flowStore';
import { useAuthStore } from '@/store/authStore';
import { nodeTypes } from '../nodes';
import FlowToolbar from './FlowToolbar';
import NodePropertiesPanel from './NodePropertiesPanel';
import toast from 'react-hot-toast';
import socketService from '@/services/socketService';
import { flowService } from '@/services/flowService';

/**
 * FlowCanvas Component
 * Main flow editor with drag-and-drop, zoom, pan, and real-time collaboration
 */
const FlowCanvas = () => {
    const {
        currentFlow,
        nodes: storeNodes,
        edges: storeEdges,
        setNodes: setStoreNodes,
        setEdges: setStoreEdges,
        setViewport,
        selectNode,
        selectEdge,
        clearSelection,
        markAsSaved,
        isDirty,
    } = useFlowStore();

    const { user } = useAuthStore();
    const autoSaveTimer = useRef(null);

    // React Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

    // Sync local state with store
    useEffect(() => {
        setNodes(storeNodes);
    }, [storeNodes, setNodes]);

    useEffect(() => {
        setEdges(storeEdges);
    }, [storeEdges, setEdges]);

    // Update store when local state changes
    useEffect(() => {
        setStoreNodes(nodes);
    }, [nodes, setStoreNodes]);

    useEffect(() => {
        setStoreEdges(edges);
    }, [edges, setStoreEdges]);

    // Auto-save functionality
    useEffect(() => {
        if (!currentFlow || !isDirty) return;

        // Clear previous timer
        if (autoSaveTimer.current) {
            clearTimeout(autoSaveTimer.current);
        }

        // Set new timer for auto-save after 5 seconds of inactivity
        autoSaveTimer.current = setTimeout(async () => {
            try {
                await flowService.updateFlow(currentFlow._id, {
                    nodes,
                    edges,
                });
                markAsSaved();
                toast.success('Flow auto-saved', { duration: 2000 });
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, 5000);

        return () => {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
            }
        };
    }, [nodes, edges, currentFlow, isDirty, markAsSaved]);

    // Real-time collaboration with Socket.IO
    useEffect(() => {
        if (!currentFlow) return;

        const flowId = currentFlow._id;

        // Connect to socket and join flow room
        socketService.connect();
        socketService.joinFlow(flowId);

        // Listen for node updates from other users
        socketService.onNodeUpdate(({ nodes: updatedNodes, updatedBy }) => {
            if (updatedBy !== socketService.getSocket()?.id) {
                setNodes(updatedNodes);
                toast('Flow updated by collaborator', { icon: '👥', duration: 2000 });
            }
        });

        // Listen for edge updates from other users
        socketService.onEdgeUpdate(({ edges: updatedEdges, updatedBy }) => {
            if (updatedBy !== socketService.getSocket()?.id) {
                setEdges(updatedEdges);
            }
        });

        // Cleanup on unmount
        return () => {
            socketService.leaveFlow(flowId);
            socketService.removeAllListeners();
        };
    }, [currentFlow, setNodes, setEdges]);

    // Emit node changes to other users
    useEffect(() => {
        if (currentFlow && socketService.isConnected()) {
            socketService.emitNodeChange(currentFlow._id, nodes);
        }
    }, [nodes, currentFlow]);

    // Emit edge changes to other users
    useEffect(() => {
        if (currentFlow && socketService.isConnected()) {
            socketService.emitEdgeChange(currentFlow._id, edges);
        }
    }, [edges, currentFlow]);

    // Handle connection between nodes
    const onConnect = useCallback(
        (params) => {
            const newEdge = {
                ...params,
                type: 'smoothstep',
                animated: true,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                },
                style: {
                    strokeWidth: 2,
                },
            };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges]
    );

    // Handle node click
    const onNodeClick = useCallback(
        (event, node) => {
            selectNode(node);
        },
        [selectNode]
    );

    // Handle edge click
    const onEdgeClick = useCallback(
        (event, edge) => {
            selectEdge(edge);
        },
        [selectEdge]
    );

    // Handle pane click (deselect)
    const onPaneClick = useCallback(() => {
        clearSelection();
    }, [clearSelection]);

    // Handle viewport change (zoom/pan)
    const onViewportChange = useCallback(
        (viewport) => {
            setViewport(viewport);
        },
        [setViewport]
    );

    // Handle node drag
    const onNodeDragStop = useCallback((event, node) => {
        console.log('Node dragged:', node);
    }, []);

    // Handle node delete
    const onNodesDelete = useCallback(
        (deleted) => {
            deleted.forEach((node) => {
                toast.success(`Deleted node: ${node.data.label}`);
            });
        },
        []
    );

    // Handle edge delete
    const onEdgesDelete = useCallback(
        (deleted) => {
            deleted.forEach(() => {
                toast.success('Connection deleted');
            });
        },
        []
    );

    // Drag and drop from toolbar
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = {
                x: event.clientX - event.currentTarget.getBoundingClientRect().left,
                y: event.clientY - event.currentTarget.getBoundingClientRect().top,
            };

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: {
                    label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                },
            };

            setNodes((nds) => [...nds, newNode]);
            toast.success(`Added ${type} node`);
        },
        [setNodes]
    );

    if (!currentFlow) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                        No Flow Selected
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Create a new flow or select an existing one to get started
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <FlowToolbar />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeDragStop={onNodeDragStop}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                onMove={onViewportChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                fitView
                deleteKeyCode="Delete"
                multiSelectionKeyCode="Shift"
                className="bg-gray-50 dark:bg-gray-900"
            >
                <Background
                    color="#94a3b8"
                    gap={16}
                    size={1}
                    className="dark:opacity-20"
                />

                <Controls
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                />

                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'start': return '#10b981';
                            case 'action': return '#3b82f6';
                            case 'decision': return '#eab308';
                            case 'api': return '#a855f7';
                            case 'end': return '#ef4444';
                            default: return '#6b7280';
                        }
                    }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                    maskColor="rgba(0, 0, 0, 0.1)"
                />

                <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 m-4">
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currentFlow.name}
                        </div>
                        {isDirty && (
                            <div className="flex items-center gap-1 text-xs text-orange-500">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                Unsaved
                            </div>
                        )}
                    </div>
                </Panel>
            </ReactFlow>

            {/* Node Properties Panel */}
            <NodePropertiesPanel />
        </div>
    );
};

export default FlowCanvas;
