import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Cloud } from 'lucide-react';

/**
 * API Node Component
 * Represents an API call or external service
 */
const APINode = ({ data, selected }) => {
    return (
        <div
            className={`
        px-6 py-4 rounded-lg shadow-lg
        bg-gradient-to-br from-purple-400 to-purple-600
        border-2 border-purple-700
        text-white font-medium
        transition-all duration-200 min-w-[150px]
        ${selected ? 'ring-4 ring-purple-300 scale-110' : 'hover:scale-105'}
      `}
        >
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    <div className="font-semibold">{data.label || 'API Call'}</div>
                </div>
                {data.description && (
                    <div className="text-xs opacity-90">{data.description}</div>
                )}
                {data.metadata?.endpoint && (
                    <div className="text-xs font-mono opacity-75 mt-1">
                        {data.metadata.endpoint}
                    </div>
                )}
            </div>

            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-purple-700 !w-3 !h-3 !border-2 !border-white"
            />

            {/* Output handles for success and error */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="success"
                className="!bg-purple-700 !w-3 !h-3 !border-2 !border-white"
                style={{ left: '35%' }}
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id="error"
                className="!bg-red-500 !w-3 !h-3 !border-2 !border-white"
                style={{ left: '65%' }}
            />
        </div>
    );
};

export default memo(APINode);
