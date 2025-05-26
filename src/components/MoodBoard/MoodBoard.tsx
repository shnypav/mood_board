import React, {useState, useRef, useEffect} from 'react';
import {AnimatePresence} from 'framer-motion';
import {useImages} from '../../contexts/ImageContext';
import {useBoards} from '../../contexts/BoardContext';
import {useZoom} from '../../contexts/ZoomContext';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {AddImageModal} from '../AddImageModalComponent';
import {EmptyState} from './EmptyState';
import {ColorPicker} from './ColorPicker';
import {BoardControls} from './BoardControls';
import {BoardIndicators} from './BoardIndicators';
import {BoardContent} from './BoardContent';
import {AddImageButton} from './AddImageButton';
import {BoardManager} from './BoardManager';
import {useBoardInteractions} from '../../hooks/useBoardInteractions';
import '../../styles/rainbow.css';

export const MoodBoard = () => {
    const { currentBoard, updateBoardBackground } = useBoards();
    const {
        images,
        removeImage,
        updateImagePosition,
        updateImageDimensions,
        updateImageRotation,
        updateImageComment, // 💬 Added comment update function
        bringToFront,
        duplicateImage,
        clearAllImages
    } = useImages();
    const {zoomLevel, setZoomLevel, panPosition, setPanPosition, zoomIn, zoomOut} = useZoom();
    const {toast} = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

    const boardRef = useRef(null);
    const predefinedColors = ['#FFCDD2', '#C8E6C9', '#BBDEFB', '#FFF9C4', '#D1C4E9'];

    // Get current background color from the current board
    const backgroundColor = currentBoard?.backgroundColor || '#ffffff';

    // Use the board interactions hook
    const {
        isPanning,
        showZoomIndicator,
        showPanIndicator,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleZoomChange,
        handleKeyboardPan,
        handleResetPan
    } = useBoardInteractions({
        panPosition,
        setPanPosition,
        zoomIn,
        zoomOut
    });

    // Handlers
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleColorChange = (color) => {
        if (currentBoard) {
            updateBoardBackground(currentBoard.id, color);
            toast({
                title: "Background updated 🎨",
                description: `Background color changed for "${currentBoard.name}".`,
                duration: 2000,
            });
        }
    };

    const handlePredefinedColorClick = (color) => {
        if (currentBoard) {
            updateBoardBackground(currentBoard.id, color);
            toast({
                title: "Background updated 🎨",
                description: `Background color changed for "${currentBoard.name}".`,
                duration: 2000,
            });
        }
    };

    const handlePositionChange = (id, newPosition, bringToFrontFlag = true) => {
        updateImagePosition(id, newPosition, bringToFrontFlag);
    };

    const handleClearAllImages = () => {
        clearAllImages();
        setIsClearConfirmOpen(false);
        toast({
            title: "All images cleared 🧹",
            description: "Your mood board has been reset.",
            duration: 2000,
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
        };
    }, [panPosition]);    // Handle wheel events for zooming
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    handleZoomChange(zoomIn)();
                } else {
                    handleZoomChange(zoomOut)();
                }
            }
        };
        const boardElement = boardRef.current as HTMLDivElement | null;
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
            {/* Board Manager */}
            <BoardManager />

            <AnimatePresence>
                {images.length === 0 ? (
                    <EmptyState onAddClick={handleOpenModal}/>
                ) : (
                    <BoardContent
                        images={images}
                        zoomLevel={zoomLevel}
                        panPosition={panPosition}
                        isPanning={isPanning}
                        handlePositionChange={handlePositionChange}
                        updateImageDimensions={updateImageDimensions}
                        updateImageRotation={updateImageRotation}
                        updateImageComment={updateImageComment} // 💬 Pass comment update function
                        removeImage={removeImage}
                        bringToFront={bringToFront}
                        duplicateImage={duplicateImage}
                    />
                )}
            </AnimatePresence>

            {/* Add Image Button */}
            <AddImageButton handleOpenModal={handleOpenModal}/>

            {/* Board Controls */}
            <BoardControls
                zoomLevel={zoomLevel}
                panPosition={panPosition}
                handleZoomChange={handleZoomChange}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                handleKeyboardPan={handleKeyboardPan}
                handleResetPan={handleResetPan}
                handleClearAllImages={handleClearAllImages}
                setIsClearConfirmOpen={setIsClearConfirmOpen}
            />

            {/* Modals and Pickers */}
            <AddImageModal isOpen={isModalOpen} onClose={handleCloseModal}/>
            <ColorPicker
                backgroundColor={backgroundColor}
                onColorChange={handleColorChange}
                predefinedColors={predefinedColors}
                onPredefinedColorClick={handlePredefinedColorClick}
            />

            {/* Indicators */}
            <BoardIndicators
                showZoomIndicator={showZoomIndicator}
                showPanIndicator={false}
                zoomLevel={zoomLevel}
                panPosition={panPosition}
            />
        </div>
    );
};