import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Socket Service for Real-time Collaboration
 */
class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    /**
     * Connect to Socket.IO server
     */
    connect() {
        if (this.socket && this.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
            this.connected = true;
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    /**
     * Disconnect from Socket.IO server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    /**
     * Join a flow room
     */
    joinFlow(flowId) {
        if (this.socket && this.connected) {
            this.socket.emit('join-flow', flowId);
            console.log(`Joined flow room: ${flowId}`);
        }
    }

    /**
     * Leave a flow room
     */
    leaveFlow(flowId) {
        if (this.socket && this.connected) {
            this.socket.emit('leave-flow', flowId);
            console.log(`Left flow room: ${flowId}`);
        }
    }

    /**
     * Emit node changes
     */
    emitNodeChange(flowId, nodes) {
        if (this.socket && this.connected) {
            this.socket.emit('node-change', { flowId, nodes });
        }
    }

    /**
     * Emit edge changes
     */
    emitEdgeChange(flowId, edges) {
        if (this.socket && this.connected) {
            this.socket.emit('edge-change', { flowId, edges });
        }
    }

    /**
     * Emit cursor movement
     */
    emitCursorMove(flowId, position, user) {
        if (this.socket && this.connected) {
            this.socket.emit('cursor-move', { flowId, position, user });
        }
    }

    /**
     * Listen for node updates
     */
    onNodeUpdate(callback) {
        if (this.socket) {
            this.socket.on('node-update', callback);
        }
    }

    /**
     * Listen for edge updates
     */
    onEdgeUpdate(callback) {
        if (this.socket) {
            this.socket.on('edge-update', callback);
        }
    }

    /**
     * Listen for cursor updates
     */
    onCursorUpdate(callback) {
        if (this.socket) {
            this.socket.on('cursor-update', callback);
        }
    }

    /**
     * Listen for user joined events
     */
    onUserJoined(callback) {
        if (this.socket) {
            this.socket.on('user-joined', callback);
        }
    }

    /**
     * Listen for user left events
     */
    onUserLeft(callback) {
        if (this.socket) {
            this.socket.on('user-left', callback);
        }
    }

    /**
     * Remove all listeners
     */
    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }

    /**
     * Get socket instance
     */
    getSocket() {
        return this.socket;
    }

    /**
     * Check if connected
     */
    isConnected() {
        return this.connected;
    }
}

// Export singleton instance
export default new SocketService();
