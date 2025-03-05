import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useImages } from '../contexts/ImageContext';
import { SidePanelGallery } from './SidePanelGallery';
import { AddImageModal } from './AddImageModalComponent';
import { Button } from '@/shadcn/components/ui/button';
import { Plus, Trash2, ImageIcon, Palette } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useToast } from "@/shadcn/components/ui/use-toast";
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { SketchPicker } from 'react-color';

const ImageCardSkeleton: React.FC = () => (
    <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-lg" />
    </div>
);

const ImageCard: React.FC<{
    id: string;
    imageUrl: string;
    position?: { x: number, y: number };
    onPositionChange: (id: string, position: { x: number, y: number }) => void;
    onRemove: (id: string) => Promise<void>;
}> = ({ id, imageUrl, position, onPositionChange, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
   const [dragPosition, setDragPosition] = useState({ x: position?.x || 0, y: position?.y || 0 });
    const { toast } = useToast();

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

    const handleDragEnd = (event: any, info: any) => {
        setIsDragging(false);
       // Update the position state with the final drag position
       const newPosition = {
           x: dragPosition.x + info.offset.x,
           y: dragPosition.y + info.offset.y
       };
       setDragPosition(newPosition);
       onPositionChange(id, newPosition);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-square group absolute"
            drag
            dragMomentum={false}
           dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
           initial={{ x: dragPosition.x, y: dragPosition.y }}
           animate={{ x: dragPosition.x, y: dragPosition.y }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '200px',
                height: '200px',
                zIndex: isDragging ? 10 : 1,
                touchAction: "none"
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

export const MoodBoard: React.FC = () => {
   const boardRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { backgroundColor, setBackgroundColor } = useTheme();
    const { images, removeImage, updateImagePosition, isLoading } = useImages();
    const { toast } = useToast();

    const predefinedColors = ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#D1C4E9'];

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleColorChange = (color: any) => {
        if (color && color.hex) {
            setBackgroundColor(color.hex);
        }
    };

    const handlePredefinedColorClick = (color: string) => {
        setBackgroundColor(color);
    };

    const handlePositionChange = (id: string, position: { x: number, y: number }) => {
        updateImagePosition(id, position);
    };

    if (isLoading) {
        return <LoadingGrid />;
    }

    return (
        <div
            className="relative min-h-[600px] p-4"
            style={{ height: '100vh' }}
           ref={boardRef}
        >
            <AnimatePresence>
                {images.length === 0 ? (
                    <EmptyState onAddClick={handleOpenModal} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-full"
                    >
                        <AnimatePresence>
                            {images.map((image) => (
                                <ImageCard
                                    key={image.id}
                                    id={image.id}
                                    imageUrl={image.imageUrl}
                                    position={image.position}
                                    onPositionChange={handlePositionChange}
                                    onRemove={removeImage}
                                />
                            ))}
                        </AnimatePresence>
                        <Button
                            className="fixed bottom-8 right-8 rounded-full h-14 w-14 shadow-lg"
                            onClick={handleOpenModal}
                            size="icon"
                        >
                            <Plus className="h-6 w-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            <AddImageModal isOpen={isModalOpen} onClose={handleCloseModal} />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="fixed bottom-8 left-8 rounded-full h-14 w-14 shadow-lg"
                        size="icon"
                    >
                        <Palette className="h-6 w-6" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-transparent">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex space-x-2">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    className="w-8 h-8 rounded-full border"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handlePredefinedColorClick(color)}
                                />
                            ))}
                        </div>
                        <SketchPicker
                            color={backgroundColor}
                            onChange={handleColorChange}
                            disableAlpha
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
