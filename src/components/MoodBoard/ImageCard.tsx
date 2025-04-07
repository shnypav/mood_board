import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Trash2, Copy } from 'lucide-react';
import { useToast } from "@/shadcn/components/ui/use-toast";
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { useZoom } from '../../contexts/ZoomContext';

export const ImageCardSkeleton: React.FC = () => (
    <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-lg" />
    </div>
);

export const ImageCard: React.FC<{
    id: string;
    imageUrl: string;
    position?: { x: number, y: number };
    zIndex: number;
    width?: number;
    height?: number;
    onPositionChange: (id: string, position: { x: number, y: number }, bringToFront?: boolean) => void;
    onDimensionsChange: (id: string, dimensions: { width: number, height: number }) => void;
    onRemove: (id: string) => Promise<void>;
    onBringToFront: (id: string) => void;
    onDuplicate: (id: string) => void;
}> = ({ id, imageUrl, position, zIndex, width, height, onPositionChange, onDimensionsChange, onRemove, onBringToFront, onDuplicate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const [dragPosition, setDragPosition] = useState({ x: position?.x || 0, y: position?.y || 0 });
    const [dimensions, setDimensions] = useState({ 
        width: width || 200, // Default width
        height: height || 200 // Default height
    });
    const { toast } = useToast();
    const { zoomLevel } = useZoom();
    const startPositionRef = useRef({ x: 0, y: 0 });
    const startDimensionsRef = useRef({ width: 0, height: 0 });
    const startResizePositionRef = useRef({ x: 0, y: 0 });
    const aspectRatioRef = useRef(1);
    const originalPositionRef = useRef({ x: 0, y: 0 });

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsRemoving(true);
            await onRemove(id);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to remove image"
            });
            setIsRemoving(false);
        }
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsDuplicating(true);
            onDuplicate(id);
            // Show success toast
            toast({
                title: "Success",
                description: "Image duplicated successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to duplicate image"
            });
        } finally {
            // Use setTimeout to provide visual feedback
            setTimeout(() => {
                setIsDuplicating(false);
            }, 300);
        }
    };

    const handleDragStart = () => {
        setIsDragging(true);
        onBringToFront(id);
        // Store the starting position for this drag operation
        startPositionRef.current = { ...dragPosition };
        originalPositionRef.current = { ...dragPosition };
    };

    const handleDragEnd = (event: any, info: any) => {
        setIsDragging(false);
        // Calculate the new position based on the starting position and the offset
        // adjusted by the zoom level
        const newPosition = {
            x: startPositionRef.current.x + (info.offset.x / zoomLevel),
            y: startPositionRef.current.y + (info.offset.y / zoomLevel)
        };
        setDragPosition(newPosition);
        // When drag ends, we do want to bring the image to front
        onPositionChange(id, newPosition, true);
    };

    // Bring image to front when clicked
    const handleClick = () => {
        onBringToFront(id);
    };

    // Load and update the image's natural dimensions
    useEffect(() => {
        if (!isLoading && (!width || !height)) {
            const img = new Image();
            img.onload = () => {
                // Calculate the aspect ratio
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                aspectRatioRef.current = aspectRatio;
                
                // Set initial dimensions while maintaining aspect ratio
                const newDimensions = {
                    width: 200, // Default width
                    height: 200 / aspectRatio
                };
                
                setDimensions(newDimensions);
                // Save to context
                onDimensionsChange(id, newDimensions);
            };
            img.src = imageUrl;
        } else if (width && height) {
            setDimensions({ width, height });
            aspectRatioRef.current = width / height;
        }
    }, [isLoading, width, height, imageUrl, id, onDimensionsChange]);
    
    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        // We want to bring the image to front visually, but we don't want to trigger
        // the bringToFront functionality that would affect other images' z-index
        // We achieve this with CSS by setting a high z-index during resize (in the style prop)
        // No need to call onBringToFront(id) here
        
        // Store the starting dimensions and position for this resize operation
        startDimensionsRef.current = { ...dimensions };
        startPositionRef.current = { ...dragPosition };
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
                    const heightRatio = newHeight / oldHeight;
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
        setDragPosition(newPosition);
    };
    
    // Handle resize end
    const handleResizeEnd = () => {
        if (isResizing) {
            setIsResizing(false);
            setResizeDirection(null);
            
            // Update the position in context if it changed during resize
            // Pass false to indicate we don't want to bring image to front during resize
            onPositionChange(id, dragPosition, false);
            
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
    }, [isResizing, resizeDirection, dimensions]);
    
    // Get the appropriate cursor based on resize direction
    const getResizeCursor = (direction: string) => {
        switch (direction) {
            case 'n': return 'ns-resize';
            case 's': return 'ns-resize';
            case 'e': return 'ew-resize';
            case 'w': return 'ew-resize';
            case 'ne': return 'nesw-resize';
            case 'nw': return 'nwse-resize';
            case 'se': return 'nwse-resize';
            case 'sw': return 'nesw-resize';
            default: return 'move';
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                x: dragPosition.x,
                y: dragPosition.y
            }}
            exit={{ opacity: 0 }}
            className="relative group absolute"
            drag={!isResizing}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                zIndex: (isDragging || isResizing) ? zIndex + 1000 : zIndex, // Extra boost during drag or resize
                touchAction: "none",
                left: 0,
                top: 0,
                transform: `translate(0, 0)` // Reset transform to avoid conflicts with motion
            }}
        >
            {isLoading && <ImageCardSkeleton />}
            <img
                src={imageUrl}
                alt="Mood board image"
                className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'} cursor-move`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
            <AnimatePresence>
                {isHovered && !isRemoving && !isDuplicating && !isDragging && !isResizing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDuplicate}
                            disabled={isDuplicating}
                            title="Duplicate Image"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleRemove}
                            disabled={isRemoving}
                            title="Remove Image"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </motion.div>
                )}
                {isRemoving && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
                    >
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                )}
                {isDuplicating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-blue-500/50 rounded-lg flex items-center justify-center"
                    >
                        <div className="w-8 h-8 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                )}
                
                {/* Resize handles - only show when hovering and not dragging/removing/duplicating */}
                {(isHovered || isResizing) && !isDragging && !isRemoving && !isDuplicating && (
                    <>
                        {/* Corner resize handles */}
                        <div 
                            className="absolute w-8 h-8 bottom-0 right-0 cursor-nwse-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 translate-y-1" />
                        </div>
                        <div 
                            className="absolute w-8 h-8 bottom-0 left-0 cursor-nesw-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'sw')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 translate-y-1" />
                        </div>
                        <div 
                            className="absolute w-8 h-8 top-0 right-0 cursor-nesw-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'ne')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute top-0 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 -translate-y-1" />
                        </div>
                        <div 
                            className="absolute w-8 h-8 top-0 left-0 cursor-nwse-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'nw')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute top-0 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 -translate-y-1" />
                        </div>
                        
                        {/* Edge resize handles */}
                        <div 
                            className="absolute h-8 w-4 inset-y-0 right-0 my-auto cursor-ew-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'e')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute top-1/2 right-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform translate-x-1 -translate-y-1/2" />
                        </div>
                        <div 
                            className="absolute h-8 w-4 inset-y-0 left-0 my-auto cursor-ew-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'w')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute top-1/2 left-0 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1 -translate-y-1/2" />
                        </div>
                        <div 
                            className="absolute w-8 h-4 inset-x-0 bottom-0 mx-auto cursor-ns-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 's')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1/2 translate-y-1" />
                        </div>
                        <div 
                            className="absolute w-8 h-4 inset-x-0 top-0 mx-auto cursor-ns-resize" 
                            onMouseDown={(e) => handleResizeStart(e, 'n')}
                            style={{ touchAction: "none" }}
                        >
                            <div className="absolute top-0 left-1/2 w-3 h-3 bg-white border border-gray-300 rounded-sm transform -translate-x-1/2 -translate-y-1" />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};