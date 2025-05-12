import React from 'react';
import {RotateCw} from 'lucide-react';

interface RotationHandleProps {
    handleRotationStart: (e: React.MouseEvent) => void;
}

export const RotationHandle: React.FC<RotationHandleProps> = ({handleRotationStart}) => {
    return (
        <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100"
            onMouseDown={handleRotationStart}
            style={{touchAction: "none"}}
        >
            <RotateCw size={14} className="text-gray-600"/>
        </div>
    );
};