import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Square } from 'lucide-react';

/**
 * End Node Component
 * Represents the end of a flow
 */
const EndNode = ({ data, selected }) => {
    return (
        <div
            className={`
        px-6 py-4 rounded-full shadow-lg
        bg-gradient-to-br from-red-400 to-red-600
        border-2 border-red-700
        text-white font-medium
        transition-all duration-200
        ${selected ? 'ring-4 ring-red-300 scale-110' : 'hover:scale-105'}
      `}
        >
            <div className="flex items-center gap-2">
                <Square className="w-5 h-5 fill-current" />
                <div>{data.label || 'End'}</div>
            </div>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-red-700 !w-3 !h-3 !border-2 !border-white"
            />
        </div>
    );
};

export default memo(EndNode);
