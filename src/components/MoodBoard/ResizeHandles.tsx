import React from 'react';

interface ResizeHandlesProps {
    handleResizeStart: (e: React.MouseEvent, direction: string) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({handleResizeStart}) => {
    return (
        <>
            {/* Corner resize handles */}
            <div
                className="absolute w-8 h-8 bottom-0 right-0 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeStart(e, 'se')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute bottom-0 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 translate-y-1"/>
            </div>
            <div
                className="absolute w-8 h-8 bottom-0 left-0 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute bottom-0 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 translate-y-1"/>
            </div>
            <div
                className="absolute w-8 h-8 top-0 right-0 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute top-0 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 -translate-y-1"/>
            </div>
            <div
                className="absolute w-8 h-8 top-0 left-0 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute top-0 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 -translate-y-1"/>
            </div>

            {/* Edge resize handles */}
            <div
                className="absolute h-8 w-4 inset-y-0 right-0 my-auto cursor-ew-resize"
                onMouseDown={(e) => handleResizeStart(e, 'e')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute top-1/2 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 -translate-y-1/2"/>
            </div>
            <div
                className="absolute h-8 w-4 inset-y-0 left-0 my-auto cursor-ew-resize"
                onMouseDown={(e) => handleResizeStart(e, 'w')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute top-1/2 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 -translate-y-1/2"/>
            </div>
            <div
                className="absolute w-8 h-4 inset-x-0 bottom-0 mx-auto cursor-ns-resize"
                onMouseDown={(e) => handleResizeStart(e, 's')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute bottom-0 left-1/2 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1/2 translate-y-1"/>
            </div>
            <div
                className="absolute w-8 h-4 inset-x-0 top-0 mx-auto cursor-ns-resize"
                onMouseDown={(e) => handleResizeStart(e, 'n')}
                style={{touchAction: "none"}}
            >
                <div
                    className="absolute top-0 left-1/2 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1/2 -translate-y-1"/>
            </div>
        </>
    );
};