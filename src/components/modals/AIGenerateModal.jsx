import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/**
 * AI Generate Modal
 * Modal for generating flows using AI
 */
const AIGenerateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        flowType: 'workflow',
    });

    const flowTypes = [
        { value: 'workflow', label: 'Workflow' },
        { value: 'call-flow', label: 'Call Flow' },
        { value: 'user-journey', label: 'User Journey' },
        { value: 'decision-tree', label: 'Decision Tree' },
        { value: 'process-flow', label: 'Process Flow' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await aiService.generateFlow(
                formData.description,
                formData.flowType,
                true // saveToDb
            );

            toast.success('AI Flow generated successfully!');
            onClose();

            // Navigate to the new flow
            if (response.data.flow) {
                navigate(`/editor/${response.data.flow._id}`);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to generate flow');
        } finally {
            setLoading(false);
        }
    };

    const examplePrompts = [
        'Customer support call flow with greeting, issue identification, and resolution',
        'E-commerce checkout process with cart, payment, and confirmation',
        'User registration with email verification and profile setup',
        'Landing page wireframe with hero, features, pricing, and contact form',
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Generate with AI
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Powered by Google Gemini
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Flow Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Flow Type
                        </label>
                        <select
                            value={formData.flowType}
                            onChange={(e) => setFormData({ ...formData, flowType: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            {flowTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Describe your flow
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={5}
                            placeholder="Example: Create a customer support call flow with initial greeting, problem identification, routing to appropriate department, and resolution confirmation..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Be specific and detailed for better results
                        </p>
                    </div>

                    {/* Example Prompts */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                            💡 Example Prompts:
                        </p>
                        <div className="space-y-2">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, description: prompt })}
                                    className="text-xs text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 text-left block hover:underline"
                                >
                                    → {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.description}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner w-5 h-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Flow
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AIGenerateModal;
