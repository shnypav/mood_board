import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Trash2 } from 'lucide-react';
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
    onPositionChange: (id: string, position: { x: number, y: number }) => void;
    onRemove: (id: string) => Promise<void>;
    onBringToFront: (id: string) => void;
}> = ({ id, imageUrl, position, zIndex, onPositionChange, onRemove, onBringToFront }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState({ x: position?.x || 0, y: position?.y || 0 });
    const { toast } = useToast();
    const { zoomLevel } = useZoom();
    const startPositionRef = useRef({ x: 0, y: 0 });

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

    const handleDragStart = () => {
        setIsDragging(true);
        onBringToFront(id);
        // Store the starting position for this drag operation
        startPositionRef.current = { ...dragPosition };
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
        onPositionChange(id, newPosition);
    };

    // Bring image to front when clicked
    const handleClick = () => {
        onBringToFront(id);
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
            className="relative aspect-square group absolute"
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '200px',
                height: '200px',
                zIndex: isDragging ? zIndex + 1000 : zIndex, // Extra boost during drag
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
                {isHovered && !isRemoving && !isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
                    >
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
            </AnimatePresence>
        </motion.div>
    );
};