import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, X } from 'lucide-react';
import { aiService } from '@/services/aiService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/**
 * Wireframe Generate Modal
 * Modal for generating website wireframes using AI
 */
const WireframeGenerateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');

    const examplePrompts = [
        'E-commerce product page with image gallery, product details, reviews, add to cart button, and related products section',
        'SaaS landing page with hero section, features grid, pricing table, testimonials, and contact form',
        'Blog homepage with header navigation, featured post, article grid, sidebar with categories, and footer',
        'Dashboard UI with sidebar menu, top navbar, stats cards, data charts, and recent activity feed',
        'Social media profile page with cover photo, profile info, post feed, and friends/followers list',
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await aiService.generateWireframe(description, true);

            toast.success('Wireframe generated successfully!');
            onClose();

            // Navigate to the new wireframe
            if (response.data.flow) {
                navigate(`/editor/${response.data.flow._id}`);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to generate wireframe');
        } finally {
            setLoading(false);
        }
    };

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
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                            <Layout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Generate Wireframe
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                AI-Powered Website Mockup
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
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Describe your webpage
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={6}
                            placeholder="Example: Landing page for a fitness app with hero section showing workout video, 3-column features grid, pricing plans, testimonials carousel, and signup form..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Describe the page layout, sections, components, and interactions
                        </p>
                    </div>

                    {/* Example Prompts */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
                            💡 Example Wireframes:
                        </p>
                        <div className="space-y-2">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setDescription(prompt)}
                                    className="text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 text-left block hover:underline w-full"
                                >
                                    → {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                        <p className="text-sm text-cyan-900 dark:text-cyan-300">
                            <span className="font-semibold">ℹ️ Wireframes include:</span>
                            <br />
                            • UI Components (Header, Nav, Hero, Cards, Footer)
                            <br />
                            • Layout Structure (Grid-based positioning)
                            <br />
                            • Interactive Elements (Buttons, Forms, Links)
                            <br />
                            • Data Components (API calls, Content loading)
                        </p>
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
                            disabled={loading || !description}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner w-5 h-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Layout className="w-5 h-5" />
                                    Generate Wireframe
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default WireframeGenerateModal;
