import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Box } from 'lucide-react';

/**
 * Action Node Component
 * Represents an action or process step
 */
const ActionNode = ({ data, selected }) => {
    const bgColor = data.color || '#3b82f6';

    return (
        <div
            className={`
        px-6 py-4 rounded-lg shadow-lg
        border-2 text-white font-medium
        transition-all duration-200 min-w-[150px]
        ${selected ? 'ring-4 ring-blue-300 scale-110' : 'hover:scale-105'}
      `}
            style={{
                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
                borderColor: `${bgColor}`,
            }}
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    <div className="font-semibold">{data.label || 'Action'}</div>
                </div>
                {data.description && (
                    <div className="text-xs opacity-90">{data.description}</div>
                )}
            </div>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-blue-700 !w-3 !h-3 !border-2 !border-white"
            />

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-blue-700 !w-3 !h-3 !border-2 !border-white"
            />
        </div>
    );
};

export default memo(ActionNode);
