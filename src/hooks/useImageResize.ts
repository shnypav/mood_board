import { useState, useRef, useEffect } from 'react';
import { useZoom } from '../contexts/ZoomContext';

interface Position {
    x: number;
    y: number;
}

interface Dimensions {
    width: number;
    height: number;
}

interface UseImageResizeProps {
    initialPosition: Position;
    initialDimensions: Dimensions;
    onPositionChange: (id: string, position: Position, bringToFront?: boolean) => void;
    onDimensionsChange: (id: string, dimensions: Dimensions) => void;
    id: string;
}

export const useImageResize = ({
    initialPosition,
    initialDimensions,
    onPositionChange,
    onDimensionsChange,
    id
}: UseImageResizeProps) => {
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState(initialDimensions);
    const [position, setPosition] = useState(initialPosition);

    const { zoomLevel } = useZoom();
    const startDimensionsRef = useRef<Dimensions>({ width: 0, height: 0 });
    const startPositionRef = useRef<Position>({ x: 0, y: 0 });
    const startResizePositionRef = useRef<Position>({ x: 0, y: 0 });
    const aspectRatioRef = useRef(1);

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);

        // Store the starting dimensions and position for this resize operation
        startDimensionsRef.current = { ...dimensions };
        startPositionRef.current = { ...position };
        startResizePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    // Handle resize move
    const handleResize = (e: MouseEvent) => {
        if (!isResizing || !resizeDirection) return;

        const deltaX = (e.clientX - startResizePositionRef.current.x) / zoomLevel;
        const deltaY = (e.clientY - startResizePositionRef.current.y) / zoomLevel;
        const startWidth = startDimensionsRef.current.width;
        const startHeight = startDimensionsRef.current.height;
        const startPosition = startPositionRef.current;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newPosition = { ...startPosition };

        // Check if shift key is pressed to maintain aspect ratio
        const maintainAspectRatio = e.shiftKey;
        const aspectRatio = aspectRatioRef.current;

        // Apply resize based on direction
        if (resizeDirection.includes('e')) {
            newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px
            if (maintainAspectRatio) {
                newHeight = newWidth / aspectRatio;
            }
        }
        if (resizeDirection.includes('s')) {
            newHeight = Math.max(50, startHeight + deltaY); // Minimum height of 50px
            if (maintainAspectRatio) {
                newWidth = newHeight * aspectRatio;
            }
        }
        if (resizeDirection.includes('w')) {
            const widthChange = -deltaX;
            newWidth = Math.max(50, startWidth + widthChange);

            // Calculate position adjustment to keep right edge fixed
            const positionXAdjustment = startWidth - newWidth;
            newPosition.x = startPosition.x + positionXAdjustment;

            if (maintainAspectRatio) {
                const oldHeight = newHeight;
                newHeight = newWidth / aspectRatio;

                // If aspect ratio is maintained, also adjust Y position proportionally
                if (resizeDirection.includes('n')) {
                    // For northwest resize, adjust both X and Y positions
                    const yAdjustment = startHeight - newHeight;
                    newPosition.y = startPosition.y + yAdjustment;
                }
            }
        }
        if (resizeDirection.includes('n')) {
            const heightChange = -deltaY;
            newHeight = Math.max(50, startHeight + heightChange);

            // Calculate position adjustment to keep bottom edge fixed
            const positionYAdjustment = startHeight - newHeight;
            newPosition.y = startPosition.y + positionYAdjustment;

            if (maintainAspectRatio) {
                const oldWidth = newWidth;
                newWidth = newHeight * aspectRatio;

                // If aspect ratio is maintained, also adjust X position proportionally
                if (resizeDirection.includes('w')) {
                    // For northwest resize, aspect ratio already handled in 'w' section
                } else {
                    // For north and northeast resize, may need to adjust position
                    if (resizeDirection.includes('e')) {
                        // No additional X adjustment needed for northeast
                    } else {
                        // For north resize with aspect ratio, adjust X to maintain center
                        const widthDifference = newWidth - oldWidth;
                        newPosition.x = startPosition.x - (widthDifference / 2);
                    }
                }
            }
        }

        // Update dimensions
        setDimensions({ width: newWidth, height: newHeight });

        // Update position to maintain visual stability during resize
        setPosition(newPosition);
    };

    // Handle resize end
    const handleResizeEnd = () => {
        if (isResizing) {
            setIsResizing(false);
            setResizeDirection(null);

            // Update the position in context if it changed during resize
            // Pass false to indicate we don't want to bring image to front during resize
            onPositionChange(id, position, false);

            // Save the final dimensions to context
            onDimensionsChange(id, dimensions);
        }
    };

    // Add and remove document event listeners for resize
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, resizeDirection, dimensions, position]);

    // Update aspect ratio
    const updateAspectRatio = (ratio: number) => {
        aspectRatioRef.current = ratio;
    };

    return {
        isResizing,
        resizeDirection,
        dimensions,
        position,
        setPosition,
        setDimensions,
        handleResizeStart,
        updateAspectRatio
    };
};