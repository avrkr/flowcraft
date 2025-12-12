import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Layout, Link, MousePointer } from 'lucide-react';

/**
 * Page Node - Represents a complete webpage/screen
 * Used for multi-page wireframe prototypes
 */
const PageNode = ({ data, selected }) => {
    const {
        label,
        pageName,
        layout = 'desktop',
        sections = [],
        actions = [],
        description
    } = data;

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all min-w-[300px] max-w-[400px] ${selected
                    ? 'border-purple-500 shadow-purple-500/50'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-purple-500"
            />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-t-xl">
                <div className="flex items-center gap-2 mb-1">
                    <Layout className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{pageName || label}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-90">
                    <span className="px-2 py-0.5 bg-white/20 rounded">
                        {layout === 'mobile' ? '📱 Mobile' : layout === 'tablet' ? '📱 Tablet' : '💻 Desktop'}
                    </span>
                </div>
            </div>

            {/* Page Content */}
            <div className="p-4 space-y-3">
                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        {description}
                    </p>
                )}

                {/* Sections */}
                {sections && sections.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <Layout className="w-3 h-3" />
                            Page Sections:
                        </h4>
                        <ul className="space-y-1">
                            {sections.map((section, idx) => (
                                <li
                                    key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400 pl-3 border-l-2 border-purple-300"
                                >
                                    {section}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Actions/Navigation */}
                {actions && actions.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                            <MousePointer className="w-3 h-3" />
                            User Actions:
                        </h4>
                        <div className="space-y-1">
                            {actions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-xs bg-purple-50 dark:bg-purple-900/20 px-2 py-1.5 rounded"
                                >
                                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                                        {action.button || action.name}
                                    </span>
                                    {action.goesTo && (
                                        <>
                                            <Link className="w-3 h-3 text-purple-500" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                → {action.goesTo}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{sections?.length || 0} sections</span>
                    <span>{actions?.length || 0} actions</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-purple-500"
            />
        </div>
    );
};

export default memo(PageNode);
