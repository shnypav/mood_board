import React from 'react';
import { RotateCw } from 'lucide-react';

interface RotationHandlesProps {
    handleRotationStart: (e: React.MouseEvent) => void;
}

export const RotationHandles: React.FC<RotationHandlesProps> = ({ handleRotationStart }) => {
    return (
        <>
            {/* Top-left rotation handle */}
            <div
                className="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 z-20"
                onMouseDown={(e) => handleRotationStart(e)}
                style={{ touchAction: "none" }}
            >
                <RotateCw size={14} className="text-gray-600" />
            </div>

            {/* Top-right rotation handle */}
            <div
                className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 z-20"
                onMouseDown={(e) => handleRotationStart(e)}
                style={{ touchAction: "none" }}
            >
                <RotateCw size={14} className="text-gray-600" />
            </div>

            {/* Bottom-left rotation handle */}
            <div
                className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 z-20"
                onMouseDown={(e) => handleRotationStart(e)}
                style={{ touchAction: "none" }}
            >
                <RotateCw size={14} className="text-gray-600" />
            </div>

            {/* Bottom-right rotation handle */}
            <div
                className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 z-20"
                onMouseDown={(e) => handleRotationStart(e)}
                style={{ touchAction: "none" }}
            >
                <RotateCw size={14} className="text-gray-600" />
            </div>
        </>
    );
};