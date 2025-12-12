import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

/**
 * Decision Node Component
 * Represents a decision point with multiple branches
 */
const DecisionNode = ({ data, selected }) => {
    return (
        <div
            className={`
        relative px-6 py-6
        bg-gradient-to-br from-yellow-400 to-yellow-600
        text-white font-medium
        transition-all duration-200
        ${selected ? 'ring-4 ring-yellow-300 scale-110' : 'hover:scale-105'}
      `}
            style={{
                width: '140px',
                height: '140px',
                transform: 'rotate(45deg)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
        >
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: 'rotate(-45deg)' }}
            >
                <div className="flex flex-col items-center gap-1">
                    <GitBranch className="w-5 h-5" />
                    <div className="text-sm font-semibold text-center">
                        {data.label || 'Decision'}
                    </div>
                </div>
            </div>

            {/* Input handle - top */}
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-yellow-700 !w-3 !h-3 !border-2 !border-white"
                style={{ transform: 'rotate(-45deg)' }}
            />

            {/* Output handles - left and right for branches */}
            <Handle
                type="source"
                position={Position.Left}
                id="yes"
                className="!bg-yellow-700 !w-3 !h-3 !border-2 !border-white"
                style={{ transform: 'rotate(-45deg)', top: '50%' }}
            />

            <Handle
                type="source"
                position={Position.Right}
                id="no"
                className="!bg-yellow-700 !w-3 !h-3 !border-2 !border-white"
                style={{ transform: 'rotate(-45deg)', top: '50%' }}
            />

            <Handle
                type="source"
                position={Position.Bottom}
                id="default"
                className="!bg-yellow-700 !w-3 !h-3 !border-2 !border-white"
                style={{ transform: 'rotate(-45deg)' }}
            />
        </div>
    );
};

export default memo(DecisionNode);
