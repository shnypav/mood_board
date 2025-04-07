import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useImages } from '../../contexts/ImageContext';
import { useZoom } from '../../contexts/ZoomContext';
import { Button } from '@/shadcn/components/ui/button';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, MoveHorizontal, Plus, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
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
    const { 
        images, 
        removeImage, 
        updateImagePosition, 
        updateImageDimensions,
        bringToFront, 
        clearAllImages, 
        duplicateImage, 
        isLoading 
    } = useImages();
    const { zoomLevel, zoomIn, zoomOut, panPosition, setPanPosition, resetPanPosition } = useZoom();
    const { toast } = useToast();
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
    const [showZoomIndicator, setShowZoomIndicator] = useState(false);
    const [showPanIndicator, setShowPanIndicator] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);
    const panTimerRef = useRef<NodeJS.Timeout | null>(null);
    const PAN_STEP = 10; // pixels to pan with arrow keys

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

    // Panning functions
    const startPan = (clientX: number, clientY: number) => {
        setIsPanning(true);
        setStartPanPoint({ x: clientX, y: clientY });
    };

    const updatePan = (clientX: number, clientY: number) => {
        if (isPanning) {
            // Calculate the difference from the starting point
            const deltaX = (clientX - startPanPoint.x) / zoomLevel;
            const deltaY = (clientY - startPanPoint.y) / zoomLevel;

            // Update the pan position
            setPanPosition({
                x: panPosition.x + deltaX,
                y: panPosition.y + deltaY
            });

            // Update the starting point for the next move
            setStartPanPoint({ x: clientX, y: clientY });

            // Show pan indicator
            showPanPositionIndicator();
        }
    };

    const endPan = () => {
        setIsPanning(false);
    };

    // Handle mouse events for panning
    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start panning if we're clicking on the board background, not on an image
        const target = e.target as HTMLElement;
        if (e.target === e.currentTarget || 
            target.classList.contains('board-container') || 
            target.classList.contains('board-content')) {
            e.preventDefault();
            startPan(e.clientX, e.clientY);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        updatePan(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        endPan();
    };

    // Handle touch events for panning
    const handleTouchStart = (e: React.TouchEvent) => {
        // Only start panning if we're touching the board background, not an image
        const target = e.target as HTMLElement;
        if (e.target === e.currentTarget || 
            target.classList.contains('board-container') || 
            target.classList.contains('board-content')) {
            startPan(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isPanning) {
            e.preventDefault(); // Prevent scrolling while panning
            updatePan(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    const handleTouchEnd = () => {
        endPan();
    };

    // Handle keyboard arrow keys for panning
    const handleKeyboardPan = (direction: 'up' | 'down' | 'left' | 'right') => {
        return () => {
            const newPanPosition = { ...panPosition };
            
            switch (direction) {
                case 'up':
                    newPanPosition.y += PAN_STEP;
                    break;
                case 'down':
                    newPanPosition.y -= PAN_STEP;
                    break;
                case 'left':
                    newPanPosition.x += PAN_STEP;
                    break;
                case 'right':
                    newPanPosition.x -= PAN_STEP;
                    break;
            }
            
            setPanPosition(newPanPosition);
            showPanPositionIndicator();
        };
    };

    // Reset pan position
    const handleResetPan = () => {
        resetPanPosition();
        showPanPositionIndicator();
    };

    // Show pan position indicator
    const showPanPositionIndicator = () => {
        setShowPanIndicator(true);
        
        // Clear any existing timer
        if (panTimerRef.current) {
            clearTimeout(panTimerRef.current);
        }
        
        // Set a new timer to hide the indicator after 2 seconds
        panTimerRef.current = setTimeout(() => {
            setShowPanIndicator(false);
        }, 2000);
    };

    // Show zoom indicator when zoom changes
    const handleZoomChange = (zoomFn: () => void) => {
        return () => {
            zoomFn();
            setShowZoomIndicator(true);

            // Clear any existing timer
            if (zoomTimerRef.current) {
                clearTimeout(zoomTimerRef.current);
            }

            // Set a new timer to hide the indicator after 2 seconds
            zoomTimerRef.current = setTimeout(() => {
                setShowZoomIndicator(false);
            }, 2000);
        };
    };

    // Clean up timers on unmount
    useEffect(() => {
        return () => {
            if (zoomTimerRef.current) {
                clearTimeout(zoomTimerRef.current);
            }
            if (panTimerRef.current) {
                clearTimeout(panTimerRef.current);
            }
        };
    }, []);

    // Add keyboard shortcut handler for Ctrl+N (Command+N on Mac)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check for Ctrl+N or Command+N (Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
                event.preventDefault(); // Prevent default browser behavior
                handleOpenModal();
            }
            
            // Arrow key panning
            if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                switch (event.key) {
                    case 'ArrowUp':
                        event.preventDefault();
                        handleKeyboardPan('up')();
                        break;
                    case 'ArrowDown':
                        event.preventDefault();
                        handleKeyboardPan('down')();
                        break;
                    case 'ArrowLeft':
                        event.preventDefault();
                        handleKeyboardPan('left')();
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        handleKeyboardPan('right')();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [panPosition]);

    // Add mouse wheel zoom handler
    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            // Only zoom if Cmd (Mac) or Ctrl (Windows) key is pressed
            if (event.metaKey || event.ctrlKey) {
                event.preventDefault();
                if (event.deltaY < 0) {
                    zoomIn();
                    setShowZoomIndicator(true);
                } else {
                    zoomOut();
                    setShowZoomIndicator(true);
                }

                // Clear any existing timer
                if (zoomTimerRef.current) {
                    clearTimeout(zoomTimerRef.current);
                }

                // Set a new timer to hide the indicator after 2 seconds
                zoomTimerRef.current = setTimeout(() => {
                    setShowZoomIndicator(false);
                }, 2000);
            }
        };

        const boardElement = boardRef.current;
        if (boardElement) {
            boardElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (boardElement) {
                boardElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [zoomIn, zoomOut]);

    const handlePositionChange = (id: string, position: { x: number, y: number }, bringToFront: boolean = true) => {
        // When position changes due to drag, we want to bring to front (default behavior)
        // For resizing, we pass false from the ImageCard component
        updateImagePosition(id, position, bringToFront);
    };

    if (isLoading) {
        return <LoadingGrid />;
    }

    useEffect(() => {
        // Add passive: false to the touch move event listener to allow preventDefault()
        const boardElement = boardRef.current;
        if (boardElement) {
            const touchMoveHandler = (e: TouchEvent) => {
                if (isPanning) {
                    e.preventDefault();
                }
            };
            
            boardElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
            
            return () => {
                boardElement.removeEventListener('touchmove', touchMoveHandler);
            };
        }
    }, [isPanning]);

    return (
        <div
            className="relative min-h-[600px] p-4 overflow-hidden"
            style={{ 
                height: '100vh',
                cursor: isPanning ? 'grabbing' : 'grab'
            }}
            ref={boardRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence>
                {images.length === 0 ? (
                    <EmptyState onAddClick={handleOpenModal} />
                ) : (
                    <div className="relative w-full h-full board-container">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full board-content"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                                transformOrigin: 'center center',
                                transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                                willChange: 'transform',
                                backgroundColor
                            }}
                        >
                            {images.map((image) => (
                                <ImageCard
                                    key={image.id}
                                    id={image.id}
                                    imageUrl={image.imageUrl}
                                    position={image.position}
                                    zIndex={image.zIndex || 1}
                                    width={image.width}
                                    height={image.height}
                                    onPositionChange={handlePositionChange}
                                    onDimensionsChange={updateImageDimensions}
                                    onRemove={removeImage}
                                    onBringToFront={bringToFront}
                                    onDuplicate={duplicateImage}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* UI Controls - Outside of the zoom container */}
            <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
                <Button
                    className="rounded-full h-14 w-14 shadow-lg"
                    onClick={handleOpenModal}
                    size="icon"
                    title="Add Image (Ctrl+N)"
                >
                    <Plus className="h-6 w-6" />
                </Button>

                <div className="flex space-x-2">
                    <div className="flex flex-col space-y-2">
                        <Button
                            className="rounded-full h-14 w-14 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleZoomChange(zoomIn)}
                            title="Zoom In (Cmd/Ctrl + Mouse Wheel Up)"
                        >
                            <ZoomIn className="h-6 w-6" />
                        </Button>
                        <Button
                            className="rounded-full h-14 w-14 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleZoomChange(zoomOut)}
                            title="Zoom Out (Cmd/Ctrl + Mouse Wheel Down)"
                        >
                            <ZoomOut className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Arrow Key Pan Controls */}
                    <div className="grid grid-cols-3 gap-1">
                        <div></div>
                        <Button
                            className="rounded-full h-10 w-10 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleKeyboardPan('up')}
                            title="Pan Up (Arrow Up)"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <div></div>
                        <Button
                            className="rounded-full h-10 w-10 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleKeyboardPan('left')}
                            title="Pan Left (Arrow Left)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            className="rounded-full h-10 w-10 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleResetPan}
                            title="Reset Pan Position"
                        >
                            <MoveHorizontal className="h-4 w-4" />
                        </Button>
                        <Button
                            className="rounded-full h-10 w-10 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleKeyboardPan('right')}
                            title="Pan Right (Arrow Right)"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <div></div>
                        <Button
                            className="rounded-full h-10 w-10 shadow-lg"
                            variant="outline"
                            size="icon"
                            onClick={handleKeyboardPan('down')}
                            title="Pan Down (Arrow Down)"
                        >
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div></div>
                    </div>

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
            </div>

            <AddImageModal isOpen={isModalOpen} onClose={handleCloseModal} />
            <ColorPicker
                backgroundColor={backgroundColor}
                onColorChange={handleColorChange}
                predefinedColors={predefinedColors}
                onPredefinedColorClick={handlePredefinedColorClick}
            />

            {/* Zoom indicator with animation */}
            <AnimatePresence>
                {showZoomIndicator && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-md shadow-sm text-xs"
                    >
                        Zoom: {Math.round(zoomLevel * 100)}%
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pan position indicator with animation */}
            <AnimatePresence>
                {showPanIndicator && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-md shadow-sm text-xs"
                    >
                        Pan: X: {Math.round(panPosition.x)}, Y: {Math.round(panPosition.y)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};