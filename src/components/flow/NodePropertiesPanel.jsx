import { useState, useEffect } from 'react';
import { X, Type, FileText, Palette, Settings } from 'lucide-react';
import { useFlowStore } from '@/store/flowStore';

/**
 * Node Properties Panel
 * Allows editing node label, description, color, and metadata
 */
const NodePropertiesPanel = () => {
    const { selectedNode, clearSelection, setNodes } = useFlowStore();

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');

    // Update local state when selected node changes
    useEffect(() => {
        if (selectedNode) {
            setLabel(selectedNode.data?.label || '');
            setDescription(selectedNode.data?.description || '');
            setColor(selectedNode.data?.color || '');
        }
    }, [selectedNode]);

    // Update node in flow store
    const updateNode = (updates) => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...updates,
                        },
                    };
                }
                return node;
            })
        );
    };

    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        setLabel(newLabel);
        updateNode({ label: newLabel });
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        updateNode({ description: newDescription });
    };

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        updateNode({ color: newColor });
    };

    // Color presets
    const colorPresets = [
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Green', value: '#10b981' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Indigo', value: '#6366f1' },
        { name: 'Gray', value: '#6b7280' },
    ];

    if (!selectedNode) return null;

    return (
        <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-10 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                        Node Properties
                    </h3>
                </div>
                <button
                    onClick={clearSelection}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                {/* Node Type Badge */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Type:
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold uppercase">
                        {selectedNode.type}
                    </span>
                </div>

                {/* Label */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Type className="w-4 h-4" />
                        Label
                    </label>
                    <input
                        type="text"
                        value={label}
                        onChange={handleLabelChange}
                        placeholder="Node label..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FileText className="w-4 h-4" />
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Add a description..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm resize-none"
                    />
                </div>

                {/* Color */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Palette className="w-4 h-4" />
                        Color
                    </label>

                    {/* Color Presets */}
                    <div className="grid grid-cols-4 gap-2">
                        {colorPresets.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => {
                                    setColor(preset.value);
                                    updateNode({ color: preset.value });
                                }}
                                className={`h-10 rounded-lg border-2 transition-all ${color === preset.value
                                    ? 'border-blue-500 scale-110'
                                    : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                    }`}
                                style={{ backgroundColor: preset.value }}
                                title={preset.name}
                            />
                        ))}
                    </div>

                    {/* Custom Color Picker */}
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={color || '#3b82f6'}
                            onChange={handleColorChange}
                            className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={handleColorChange}
                            placeholder="#3b82f6"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm font-mono"
                        />
                    </div>
                </div>

                {/* Node Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">ID:</span> {selectedNode.id}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Position:</span> X:{' '}
                        {Math.round(selectedNode.position?.x || 0)}, Y:{' '}
                        {Math.round(selectedNode.position?.y || 0)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodePropertiesPanel;
