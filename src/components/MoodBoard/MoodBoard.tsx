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
        addImage, // 🖼️ Added missing addImage function
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

    // 🌍 Initialize board interactions with infinite canvas support
    const {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheel,
        isPanning
    } = useBoardInteractions({
        boardPosition: panPosition,
        setBoardPosition: setPanPosition,
        zoom: zoomLevel
    });

    // Handlers
    const handleOpenModal = () => {
        console.log('🎯 handleOpenModal called!'); // 🐛 Debug log
        console.log('🔍 Current isModalOpen state:', isModalOpen); // 🐛 Debug log
        setIsModalOpen(true);
        console.log('✅ setIsModalOpen(true) called!'); // 🐛 Debug log
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleColorChange = (color) => {
        if (currentBoard) {
            updateBoardBackground(currentBoard.id, color.hex);
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

    // 🎯 Reset pan position to center
    const handleResetPan = () => {
        setPanPosition({ x: 0, y: 0 });
        toast({
            title: "View reset 🎯",
            description: "Board view has been centered.",
            duration: 1500,
        });
    };

    // ⌨️ Keyboard panning support
    const handleKeyboardPan = (direction: string) => () => {
        const panStep = 100 / zoomLevel; // Adjust step based on zoom
        const newPosition = { ...panPosition };

        switch (direction) {
            case 'up':
                newPosition.y += panStep;
                break;
            case 'down':
                newPosition.y -= panStep;
                break;
            case 'left':
                newPosition.x += panStep;
                break;
            case 'right':
                newPosition.x -= panStep;
                break;
        }

        setPanPosition(newPosition);
    };

    return (
        <div className="mood-board-container">
            <div className="mood-board-header">
                <BoardManager />
            </div>
            <div
                ref={boardRef}
                className="mood-board-canvas"
                style={{
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: backgroundColor === 'rainbow' ? 'transparent' : backgroundColor,
                    cursor: isPanning ? 'grabbing' : 'grab',
                }}
                // 🌍 Enable board interactions for infinite canvas
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* 🌈 Rainbow background overlay */}
                {backgroundColor === 'rainbow' && (
                    <div className="rainbow-background" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />
                )}

                <div
                    className="board-content"
                    style={{
                        // 🌍 Both zoom AND pan for infinite canvas effect
                        transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        zIndex: 1,
                        transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                    }}
                >
                    {/* 🖼️ Only show board content when images exist */}
                    {images.length > 0 && (
                        <BoardContent
                            images={images}
                            zoomLevel={zoomLevel}
                            panPosition={panPosition} // 🌍 Pass real pan position
                            isPanning={isPanning} // 📊 Pass panning state
                            handlePositionChange={handlePositionChange}
                            updateImageDimensions={updateImageDimensions}
                            updateImageRotation={updateImageRotation}
                            updateImageComment={updateImageComment} // 💬 Comment support
                            removeImage={removeImage}
                            bringToFront={bringToFront}
                            duplicateImage={duplicateImage}
                        />
                    )}
                </div>

                {/* 🎯 Empty state positioned absolutely to stay centered regardless of pan */}
                {images.length === 0 && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ zIndex: 2 }}
                    >
                        <EmptyState onAddImage={handleOpenModal} />
                    </div>
                )}
            </div>

            {/* 🎨 Color picker for background */}
            <div className="absolute bottom-8 left-8">
                <ColorPicker
                    backgroundColor={backgroundColor}
                    onColorChange={handleColorChange}
                    predefinedColors={predefinedColors}
                    onPredefinedColorClick={handlePredefinedColorClick}
                />
            </div>

            {/* ➕ Add image button */}
            <AddImageButton onClick={handleOpenModal} />

            {/* 🎛️ Board controls with full functionality restored */}
            <div className="absolute bottom-8 right-8">
                <BoardControls
                    zoomLevel={zoomLevel}
                    panPosition={panPosition} // 🌍 Real pan position
                    handleZoomChange={(zoomFunc) => () => zoomFunc()}
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                    handleKeyboardPan={handleKeyboardPan} // ⌨️ Keyboard panning
                    handleResetPan={handleResetPan} // 🎯 Reset functionality
                    handleClearAllImages={handleClearAllImages}
                    setIsClearConfirmOpen={setIsClearConfirmOpen}
                />
            </div>

            {/* 📱 Add image modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <AddImageModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        addImage={addImage}
                    />
                )}
            </AnimatePresence>

            {/* 📊 Board indicators */}
            <BoardIndicators
                zoomLevel={zoomLevel}
                panPosition={panPosition}
                imageCount={images.length}
                isClearConfirmOpen={isClearConfirmOpen}
                setIsClearConfirmOpen={setIsClearConfirmOpen}
                handleClearAllImages={handleClearAllImages}
            />
        </div>
    );
};