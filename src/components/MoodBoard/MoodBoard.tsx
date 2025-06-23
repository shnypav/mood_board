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
/**
 * MoodBoard Component
 *
 * A component that displays a collection of images in a grid layout to create a mood board.
 * Users can add, remove, and rearrange images to create a visual representation of their ideas.
 *
 * @component
 * @example
 * ```tsx
 * <MoodBoard
 *   images={imagesArray}
 *   onImageAdd={handleImageAdd}
 *   onImageRemove={handleImageRemove}
 *   editable={true}
 * />
 * ```
 *
 * @param {Object} props - The component props
 * @param {Array<Image>} props.images - Array of image objects to display on the mood board
 * @param {Function} [props.onImageAdd] - Callback function when an image is added
 * @param {Function} [props.onImageRemove] - Callback function when an image is removed
 * @param {boolean} [props.editable=false] - Whether the mood board is editable
 * @param {string} [props.className] - Additional CSS class names
 * @returns {JSX.Element} The rendered MoodBoard component
 */
export const MoodBoard = () => {
    const {currentBoard, updateBoardBackground} = useBoards();
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
    const handleOpenModal = () => setIsModalOpen(true);
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
        setPanPosition({x: 0, y: 0});
        toast({
            title: "View reset 🎯",
            description: "Board view has been centered.",
            duration: 1500,
        });
    };

    // ⌨️ Keyboard panning support
    const handleKeyboardPan = (direction: string) => () => {
        const panStep = 100 / zoomLevel; // Adjust step based on zoom
        const newPosition = {...panPosition};

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
                <BoardManager/>
            </div>
            <div
                ref={boardRef}
                className={`mood-board-canvas ${backgroundColor === 'rainbow' ? 'rainbow-background' : ''}`}
                style={{
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: backgroundColor !== 'rainbow' ? backgroundColor : 'transparent',
                    cursor: isPanning ? 'grabbing' : 'grab', // 🖱️ Visual feedback for panning
                }}
                // 🌍 Enable board interactions for infinite canvas
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
            >
                <div
                    className="board-content"
                    style={{
                        // 🌍 Both zoom AND pan for infinite canvas effect
                        transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transition: isPanning ? 'none' : 'transform 0.2s ease-out', // 🎭 Smooth transitions when not panning
                    }}
                >
                    {/* 🖼️ Show images when they exist */}
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

                {/* 🖼️ Empty state positioned OUTSIDE transformed container - CENTERED IN WINDOW! */}
                {images.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <div className="mb-8 pointer-events-auto">
                            <svg
                                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h2 className="text-xl font-semibold mb-2">Your mood board is empty</h2>
                            <p className="text-gray-600 mb-6">
                                Start building your mood board by adding your first image
                            </p>
                            <button
                                onClick={handleOpenModal}
                                className="rainbow-button text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Add Your First Image
                            </button>
                        </div>
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
            <AddImageButton handleOpenModal={handleOpenModal}/>

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
                    />
                )}
            </AnimatePresence>
        </div>
    );
};