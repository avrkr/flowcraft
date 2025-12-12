import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Grid3x3,
    List,
    LogOut,
    Sun,
    Moon,
    Workflow,
    Clock,
    User,
    Sparkles,
    Trash2,
    Layout,
} from 'lucide-react';
import { flowService } from '@/services/flowService';
import { useAuthStore } from '@/store/authStore';
import { useFlowStore } from '@/store/flowStore';
import { useUIStore } from '@/store/uiStore';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import AIGenerateModal from '@/components/modals/AIGenerateModal';
import WireframeGenerateModal from '@/components/modals/WireframeGenerateModal';

/**
 * Dashboard Page with AI Generation, Wireframe, and Delete Features
 */
const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { setCurrentFlow } = useFlowStore();
    const { theme, toggleTheme } = useUIStore();

    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showWireframeModal, setShowWireframeModal] = useState(false);
    const [newFlowData, setNewFlowData] = useState({
        name: '',
        description: '',
    });

    // Load flows
    useEffect(() => {
        loadFlows();
    }, []);

    const loadFlows = async () => {
        try {
            setLoading(true);
            const response = await flowService.getFlows();
            setFlows(response.data.flows);
        } catch (error) {
            toast.error('Failed to load flows');
        } finally {
            setLoading(false);
        }
    };

    // Create new flow manually
    const handleCreateFlow = async (e) => {
        e.preventDefault();

        try {
            const response = await flowService.createFlow(newFlowData);
            toast.success('Flow created successfully');
            setShowCreateModal(false);
            setNewFlowData({ name: '', description: '' });
            navigate(`/editor/${response.data.flow._id}`);
        } catch (error) {
            toast.error(error.message || 'Failed to create flow');
        }
    };

    // Open flow
    const handleOpenFlow = (flow) => {
        setCurrentFlow(flow);
        navigate(`/editor/${flow._id}`);
    };

    // Delete flow
    const handleDeleteFlow = async (flowId, e) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this flow?')) return;

        try {
            await flowService.deleteFlow(flowId);
            toast.success('Flow deleted successfully');
            loadFlows();
        } catch (error) {
            toast.error(error.message || 'Failed to delete flow');
        }
    };

    // Logout
    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    // Filter flows
    const filteredFlows = flows.filter(
        (flow) =>
            flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            flow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-2">
                                <Workflow className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                FlowCraft
                            </h1>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                )}
                            </button>

                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user?.name}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search flows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    {/* AI Generate Button */}
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        AI Generate
                    </button>

                    {/* Wireframe Button */}
                    <button
                        onClick={() => setShowWireframeModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                    >
                        <Layout className="w-5 h-5" />
                        Wireframe
                    </button>

                    {/* Create Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Flow
                    </button>
                </div>

                {/* Flows */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="spinner w-12 h-12" />
                    </div>
                ) : filteredFlows.length === 0 ? (
                    <div className="text-center py-16">
                        <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No flows found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Create your first flow or use AI to generate one
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowAIModal(true)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                AI Generate
                            </button>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                Create Manually
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }
                    >
                        {filteredFlows.map((flow) => (
                            <motion.div
                                key={flow._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => handleOpenFlow(flow)}
                                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden group"
                            >
                                <div className="p-6 pb-16">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {flow.name}
                                    </h3>
                                    {flow.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {flow.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {formatDistanceToNow(new Date(flow.updatedAt), {
                                                addSuffix: true,
                                            })}
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                                {flow.nodes?.length || 0} nodes
                                            </span>
                                            {flow.tags?.includes('ai-generated') && (
                                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    AI
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDeleteFlow(flow._id, e)}
                                    className="absolute bottom-4 right-4 p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete flow"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Flow Modal */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowCreateModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Create New Flow
                        </h2>
                        <form onSubmit={handleCreateFlow} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Flow Name
                                </label>
                                <input
                                    type="text"
                                    value={newFlowData.name}
                                    onChange={(e) =>
                                        setNewFlowData({ ...newFlowData, name: e.target.value })
                                    }
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="My Awesome Flow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={newFlowData.description}
                                    onChange={(e) =>
                                        setNewFlowData({
                                            ...newFlowData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Describe your flow..."
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* AI Generate Modal */}
            <AIGenerateModal
                isOpen={showAIModal}
                onClose={() => setShowAIModal(false)}
            />

            {/* Wireframe Generate Modal */}
            <WireframeGenerateModal
                isOpen={showWireframeModal}
                onClose={() => setShowWireframeModal(false)}
            />
        </div>
    );
};

export default DashboardPage;
