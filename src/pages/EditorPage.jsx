import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import FlowCanvas from '@/components/flow/FlowCanvas';
import { useFlowStore } from '@/store/flowStore';
import { useUIStore } from '@/store/uiStore';
import { flowService } from '@/services/flowService';
import toast from 'react-hot-toast';

/**
 * Flow Editor Page - Simplified
 * Removed Save/Import/Export (auto-save handles saving)
 */
const EditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { currentFlow, setCurrentFlow, isDirty } = useFlowStore();
    const { toggleTheme, theme } = useUIStore();

    // Load flow when component mounts
    useEffect(() => {
        if (id) {
            loadFlow(id);
        }

        return () => {
            // Cleanup when leaving
        };
    }, [id]);

    const loadFlow = async (flowId) => {
        try {
            const response = await flowService.getFlow(flowId);
            console.log('Flow loaded:', response.data.flow);
            console.log('Nodes:', response.data.flow.nodes);
            console.log('Edges:', response.data.flow.edges);
            setCurrentFlow(response.data.flow);
        } catch (error) {
            console.error('Failed to load flow:', error);
            toast.error('Failed to load flow');
            navigate('/dashboard');
        }
    };

    const handleBack = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                navigate('/dashboard');
            }
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Top Bar - Simplified */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <div>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {currentFlow?.name || 'Loading...'}
                        </h1>
                        {isDirty && (
                            <p className="text-xs text-orange-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                Auto-saving...
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">1</span>
                    </div>
                </div>
            </header>

            {/* Flow Canvas */}
            <div className="flex-1 overflow-hidden">
                <FlowCanvas />
            </div>
        </div>
    );
};

export default EditorPage;
