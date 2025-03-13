import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useImages } from '../../contexts/ImageContext';
import { Button } from '@/shadcn/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from "@/shadcn/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { AddImageModal } from '../AddImageModalComponent';
import { ImageCard } from './ImageCard';
import { EmptyState } from './EmptyState';
import { ColorPicker } from './ColorPicker';
import { LoadingGrid } from './LoadingGrid';
import '../../styles/rainbow.css';

export const MoodBoard: React.FC = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { backgroundColor, setBackgroundColor } = useTheme();
    const { images, removeImage, updateImagePosition, bringToFront, clearAllImages, isLoading } = useImages();
    const { toast } = useToast();
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

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

    const handleClearAllImages = () => {
        clearAllImages();
        toast({
            title: "Success",
            description: "All images have been cleared from the mood board",
        });
        setIsClearConfirmOpen(false);
    };

    // Add keyboard shortcut handler for Ctrl+N (Command+N on Mac)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+N or Command+N (Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault(); // Prevent default browser behavior
                handleOpenModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                                    zIndex={image.zIndex || 1}
                                    onPositionChange={handlePositionChange}
                                    onRemove={removeImage}
                                    onBringToFront={bringToFront}
                                />
                            ))}
                        </AnimatePresence>
                        <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
                            <Button
                                className="rounded-full h-14 w-14 shadow-lg"
                                onClick={handleOpenModal}
                                size="icon"
                                title="Add Image (Ctrl+N)"
                            >
                                <Plus className="h-6 w-6" />
                            </Button>

                            <Popover open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        className="rounded-full h-14 w-14 shadow-lg"
                                        variant="outline"
                                        size="icon"
                                        title="Clear All Images"
                                    >
                                        <RefreshCw className="h-6 w-6" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Clear all images?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            This will remove all images from your mood board. This action cannot be undone.
                                        </p>
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsClearConfirmOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleClearAllImages}
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AddImageModal isOpen={isModalOpen} onClose={handleCloseModal} />
            <ColorPicker
                backgroundColor={backgroundColor}
                onColorChange={handleColorChange}
                predefinedColors={predefinedColors}
                onPredefinedColorClick={handlePredefinedColorClick}
            />
        </div>
    );
};