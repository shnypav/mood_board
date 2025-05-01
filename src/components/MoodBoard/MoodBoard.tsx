import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useTheme} from '../../contexts/ThemeContext';
import {useImages} from '../../contexts/ImageContext';
import {useZoom} from '../../contexts/ZoomContext';
import {Button} from '@/shadcn/components/ui/button';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    MoveHorizontal,
    Plus,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Settings
} from 'lucide-react';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {Popover, PopoverContent, PopoverTrigger} from '@/shadcn/components/ui/popover';
import {AddImageModal} from '../AddImageModalComponent';
import {ImageCard} from './ImageCard';
import {EmptyState} from './EmptyState';
import {ColorPicker} from './ColorPicker';
import {LoadingGrid} from './LoadingGrid';
import '../../styles/rainbow.css';

export const MoodBoard = () => {
    const {backgroundColor, setBackgroundColor} = useTheme();
    const {images, removeImage, updateImageDimensions, bringToFront, duplicateImage, clearAllImages} = useImages();
    const {zoomLevel, setZoomLevel, panPosition, setPanPosition, zoomIn, zoomOut} = useZoom();
    const {toast} = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({x: 0, y: 0});
    const [showZoomIndicator, setShowZoomIndicator] = useState(false);
    const [showPanIndicator, setShowPanIndicator] = useState(false);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

    const boardRef = useRef(null);
    const predefinedColors = ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#6c757d', '#212529', '#000000', 'rainbow'];

    // Handlers
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleColorChange = (color) => {
        setBackgroundColor(color);
    };

    const handlePredefinedColorClick = (color) => {
        setBackgroundColor(color);
    };

    const handlePositionChange = (id, newPosition) => {
        // Implementation for position change
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button
            setIsPanning(true);
            setStartPanPosition({
                x: e.clientX - panPosition.x,
                y: e.clientY - panPosition.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isPanning) {
            const newX = e.clientX - startPanPosition.x;
            const newY = e.clientY - startPanPosition.y;
            setPanPosition({x: newX, y: newY});
            setShowPanIndicator(true);
            // Clear the timeout if it exists
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
            // Set a new timeout
            window.panIndicatorTimeout = setTimeout(() => {
                setShowPanIndicator(false);
            }, 1500);
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            setIsPanning(true);
            setStartPanPosition({
                x: e.touches[0].clientX - panPosition.x,
                y: e.touches[0].clientY - panPosition.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isPanning && e.touches.length === 1) {
            const newX = e.touches[0].clientX - startPanPosition.x;
            const newY = e.touches[0].clientY - startPanPosition.y;
            setPanPosition({x: newX, y: newY});
            setShowPanIndicator(true);
            // Clear the timeout if it exists
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
            // Set a new timeout
            window.panIndicatorTimeout = setTimeout(() => {
                setShowPanIndicator(false);
            }, 1500);
        }
    };

    const handleTouchEnd = () => {
        setIsPanning(false);
    };

    const handleZoomChange = (zoomFunc) => () => {
        zoomFunc();
        setShowZoomIndicator(true);
        // Clear the timeout if it exists
        if (window.zoomIndicatorTimeout) {
            clearTimeout(window.zoomIndicatorTimeout);
        }
        // Set a new timeout
        window.zoomIndicatorTimeout = setTimeout(() => {
            setShowZoomIndicator(false);
        }, 1500);
    };

    const handleKeyboardPan = (direction) => () => {
        const panStep = 50; // pixels to move per click
        let newX = panPosition.x;
        let newY = panPosition.y;

        switch (direction) {
            case 'up':
                newY += panStep;
                break;
            case 'down':
                newY -= panStep;
                break;
            case 'left':
                newX += panStep;
                break;
            case 'right':
                newX -= panStep;
                break;
        }

        setPanPosition({x: newX, y: newY});
        setShowPanIndicator(true);
        // Clear the timeout if it exists
        if (window.panIndicatorTimeout) {
            clearTimeout(window.panIndicatorTimeout);
        }
        // Set a new timeout
        window.panIndicatorTimeout = setTimeout(() => {
            setShowPanIndicator(false);
        }, 1500);
    };

    const handleResetPan = () => {
        setPanPosition({x: 0, y: 0});
        setShowPanIndicator(true);
        // Clear the timeout if it exists
        if (window.panIndicatorTimeout) {
            clearTimeout(window.panIndicatorTimeout);
        }
        // Set a new timeout
        window.panIndicatorTimeout = setTimeout(() => {
            setShowPanIndicator(false);
        }, 1500);
    };

    const handleClearAllImages = () => {
        clearAllImages();
        setIsClearConfirmOpen(false);
        toast({
            title: "All images cleared",
            description: "Your mood board has been reset.",
        });
    };

    // Add keyboard event listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Handle keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'n') {
                    e.preventDefault();
                    handleOpenModal();
                }
            }

            // Arrow keys for panning
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        handleKeyboardPan('up')();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        handleKeyboardPan('down')();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        handleKeyboardPan('left')();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        handleKeyboardPan('right')();
                        break;
                }
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // Clear any remaining timeouts
            if (window.zoomIndicatorTimeout) {
                clearTimeout(window.zoomIndicatorTimeout);
            }
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
        };
    }, [panPosition]);

    // Handle wheel events for zooming
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    handleZoomChange(zoomIn)();
                } else {
                    handleZoomChange(zoomOut)();
                }
            }
        };

        const boardElement = boardRef.current;
        if (boardElement) {
            boardElement.addEventListener('wheel', handleWheel, {passive: false});
        }

        return () => {
            if (boardElement) {
                boardElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [zoomLevel]);

    return (
        <div
            className={`relative min-h-[600px] p-4 overflow-hidden ${backgroundColor === 'rainbow' ? 'rainbow-background' : ''}`}
            style={{
                height: '100vh',
                cursor: isPanning ? 'grabbing' : 'grab',
                backgroundColor: backgroundColor === 'rainbow' ? 'transparent' : backgroundColor
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
                    <EmptyState onAddClick={handleOpenModal}/>
                ) : (
                    <div className="relative w-full h-full board-container">
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="relative w-full h-full board-content"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                                transformOrigin: 'center center',
                                transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                                willChange: 'transform'
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
            </AnimatePresence>            {/* Add Image button - Centered at bottom - UPDATED WITH RAINBOW */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                <Button
                    className="rounded-full h-16 w-16 shadow-lg rainbow-button"
                    onClick={handleOpenModal}
                    size="icon"
                    title="Add Image (Ctrl+N)"
                >
                    <Plus className="h-7 w-7"/>
                </Button>
            </div>
            {/* Unified Controls Button - Replaced the old controls section */}
            <div className="fixed bottom-8 right-8">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="rounded-full h-16 w-16 shadow-lg rainbow-button"
                            size="icon"
                            title="Board Controls"
                        >
                            <Settings className="h-7 w-7"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" side="top">
                        <motion.div
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            transition={{duration: 0.2}}
                            className="space-y-4"
                        >
                            <h4 className="font-medium mb-2">Board Controls</h4>
                            {/* Zoom Controls */}
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">Zoom</h5>
                                <div className="flex space-x-2">
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomChange(zoomIn)}
                                        title="Zoom In (Cmd/Ctrl + Mouse Wheel Up)"
                                    >
                                        <ZoomIn className="h-4 w-4"/>
                                    </Button>
                                    <div className="flex-1 flex items-center justify-center text-sm">
                                        {Math.round(zoomLevel * 100)}%
                                    </div>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleZoomChange(zoomOut)}
                                        title="Zoom Out (Cmd/Ctrl + Mouse Wheel Down)"
                                    >
                                        <ZoomOut className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            {/* Pan Controls */}
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">Pan</h5>
                                <div className="grid grid-cols-3 gap-1">
                                    <div></div>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleKeyboardPan('up')}
                                        title="Pan Up (Arrow Up)"
                                    >
                                        <ArrowUp className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleKeyboardPan('left')}
                                        title="Pan Left (Arrow Left)"
                                    >
                                        <ArrowLeft className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleResetPan}
                                        title="Reset Pan Position"
                                    >
                                        <MoveHorizontal className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleKeyboardPan('right')}
                                        title="Pan Right (Arrow Right)"
                                    >
                                        <ArrowRight className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                    <Button
                                        className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleKeyboardPan('down')}
                                        title="Pan Down (Arrow Down)"
                                    >
                                        <ArrowDown className="h-4 w-4"/>
                                    </Button>
                                    <div></div>
                                </div>
                                <div className="text-xs text-center text-muted-foreground mt-1">
                                    X: {Math.round(panPosition.x)}, Y: {Math.round(panPosition.y)}
                                </div>
                            </div>
                            {/* Clear All Button */}
                            <div className="pt-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            className="w-full rainbow-button"
                                            variant="outline"
                                            title="Clear All Images"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2"/> Clear All Images
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Clear all images?</h4>
                                            <p className="text-sm text-muted-foreground">
                                                This will remove all images from your mood board. This action cannot be
                                                undone.
                                            </p>
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    className="rainbow-button"
                                                    onClick={() => setIsClearConfirmOpen(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="rainbow-button"
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
                    </PopoverContent>
                </Popover>
            </div>

            <AddImageModal isOpen={isModalOpen} onClose={handleCloseModal}/>
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
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
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
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
                        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-md shadow-sm text-xs"
                    >
                        Pan: X: {Math.round(panPosition.x)}, Y: {Math.round(panPosition.y)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
