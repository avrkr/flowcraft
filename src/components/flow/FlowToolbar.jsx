import { useRef, useState } from 'react';
import { Play, Box, GitBranch, Cloud, Square, Save, Download, Upload, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { flowService } from '@/services/flowService';
import { useFlowStore } from '@/store/flowStore';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * FlowToolbar Component
 * ⬇️ Download = IMPORT (bringing files IN)
 * ⬆️ Upload = EXPORT (sending files OUT)
 */
const FlowToolbar = () => {
    const { currentFlow, nodes, edges, setNodes, setEdges, markAsSaved } = useFlowStore();
    const fileInputRef = useRef(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Node types for drag and drop
    const nodeTypes = [
        { type: 'start', icon: Play, label: 'Start', color: 'bg-green-500' },
        { type: 'action', icon: Box, label: 'Action', color: 'bg-blue-500' },
        { type: 'decision', icon: GitBranch, label: 'Decision', color: 'bg-yellow-500' },
        { type: 'api', icon: Cloud, label: 'API', color: 'bg-purple-500' },
        { type: 'end', icon: Square, label: 'End', color: 'bg-red-500' },
    ];

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleSave = async () => {
        if (!currentFlow) {
            toast.error('No flow loaded');
            return;
        }

        try {
            await flowService.updateFlow(currentFlow._id, { nodes, edges });
            markAsSaved();
            toast.success('Flow saved');
        } catch (error) {
            toast.error('Failed to save');
        }
    };

    // Export as JSON
    const handleExportJSON = async () => {
        if (!currentFlow) {
            toast.error('No flow to export');
            return;
        }

        try {
            const response = await flowService.exportFlow(currentFlow._id);
            const dataStr = JSON.stringify(response.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentFlow.name}.json`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Exported as JSON');
            setShowExportMenu(false);
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    // Export as PNG
    const handleExportPNG = async () => {
        if (!currentFlow) {
            toast.error('No flow to export');
            return;
        }

        try {
            const element = document.querySelector('.react-flow__viewport');
            if (!element) {
                toast.error('Canvas not ready');
                return;
            }

            toast.loading('Generating PNG...');

            const dataUrl = await toPng(element, {
                backgroundColor: '#ffffff',
                cacheBust: true,
                pixelRatio: 2,
            });

            const link = document.createElement('a');
            link.download = `${currentFlow.name}.png`;
            link.href = dataUrl;
            link.click();

            toast.dismiss();
            toast.success('Exported as PNG');
            setShowExportMenu(false);
        } catch (error) {
            toast.dismiss();
            toast.error('PNG export failed');
            console.error('PNG error:', error);
        }
    };

    // Export as JPEG
    const handleExportJPEG = async () => {
        if (!currentFlow) {
            toast.error('No flow to export');
            return;
        }

        try {
            const element = document.querySelector('.react-flow__viewport');
            if (!element) {
                toast.error('Canvas not ready');
                return;
            }

            toast.loading('Generating JPEG...');

            const dataUrl = await toJpeg(element, {
                backgroundColor: '#ffffff',
                quality: 0.95,
                cacheBust: true,
                pixelRatio: 2,
            });

            const link = document.createElement('a');
            link.download = `${currentFlow.name}.jpeg`;
            link.href = dataUrl;
            link.click();

            toast.dismiss();
            toast.success('Exported as JPEG');
            setShowExportMenu(false);
        } catch (error) {
            toast.dismiss();
            toast.error('JPEG export failed');
            console.error('JPEG error:', error);
        }
    };

    // Export as PDF
    const handleExportPDF = async () => {
        if (!currentFlow) {
            toast.error('No flow to export');
            return;
        }

        try {
            const element = document.querySelector('.react-flow__viewport');
            if (!element) {
                toast.error('Canvas not ready');
                return;
            }

            toast.loading('Generating PDF...');

            const dataUrl = await toPng(element, {
                backgroundColor: '#ffffff',
                cacheBust: true,
                pixelRatio: 2,
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [element.offsetWidth * 2, element.offsetHeight * 2],
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth * 2, element.offsetHeight * 2);
            pdf.save(`${currentFlow.name}.pdf`);

            toast.dismiss();
            toast.success('Exported as PDF');
            setShowExportMenu(false);
        } catch (error) {
            toast.dismiss();
            toast.error('PDF export failed');
            console.error('PDF error:', error);
        }
    };

    // Import flow from JSON
    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            toast.error('Please select a JSON file');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.nodes || !data.edges) {
                toast.error('Invalid flow file');
                return;
            }

            setNodes(data.nodes);
            setEdges(data.edges);

            if (currentFlow) {
                await flowService.updateFlow(currentFlow._id, {
                    nodes: data.nodes,
                    edges: data.edges,
                });
                markAsSaved();
            }

            toast.success('Flow imported');
            event.target.value = '';
        } catch (error) {
            toast.error('Import failed');
            console.error(error);
        }
    };

    return (
        <>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {/* Node palette */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex gap-2 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-2 flex items-center">
                        Nodes:
                    </div>
                    {nodeTypes.map(({ type, icon: Icon, label, color }) => (
                        <button
                            key={type}
                            draggable
                            onDragStart={(e) => onDragStart(e, type)}
                            className={`${color} text-white p-2 rounded-lg hover:scale-110 transition-all duration-200 cursor-grab active:cursor-grabbing flex items-center gap-1 text-sm font-medium shadow-md hover:shadow-lg`}
                            title={`Drag to add ${label}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 border border-gray-200 dark:border-gray-700">
                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Save Flow"
                    >
                        <Save className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                    {/* Import (⬇️ Download icon) */}
                    <button
                        onClick={handleImport}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Import JSON"
                    >
                        <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Export (⬆️ Upload icon with dropdown) */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center gap-1"
                            title="Export Flow"
                        >
                            <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            <ChevronDown className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                        </button>

                        {showExportMenu && (
                            <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                                <button
                                    onClick={handleExportPNG}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-t-lg font-medium"
                                >
                                    📷 Export as PNG
                                </button>
                                <button
                                    onClick={handleExportJPEG}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 font-medium"
                                >
                                    🖼️ Export as JPEG
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 font-medium"
                                >
                                    📄 Export as PDF
                                </button>
                                <button
                                    onClick={handleExportJSON}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 rounded-b-lg font-medium"
                                >
                                    💾 Export as JSON
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>

            {showExportMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                />
            )}
        </>
    );
};

export default FlowToolbar;
