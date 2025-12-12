import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

/**
 * Start Node Component
 * Visual representation of a flow start point
 */
const StartNode = ({ data, selected }) => {
    return (
        <div
            className={`
        px-6 py-4 rounded-full shadow-lg
        bg-gradient-to-br from-green-400 to-green-600
        border-2 border-green-700
        text-white font-medium
        transition-all duration-200
        ${selected ? 'ring-4 ring-green-300 scale-110' : 'hover:scale-105'}
      `}
        >
            <div className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                <div>{data.label || 'Start'}</div>
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-green-700 !w-3 !h-3 !border-2 !border-white"
            />
        </div>
    );
};

export default memo(StartNode);
