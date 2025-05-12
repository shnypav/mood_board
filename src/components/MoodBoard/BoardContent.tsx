import React from 'react';
import {motion} from 'framer-motion';
import {ImageCard} from './ImageCard';

interface BoardContentProps {
    images: Array<{
        id: string;
        imageUrl: string;
        position?: { x: number, y: number };
        zIndex: number;
        width?: number;
        height?: number;
        rotation?: number;
    }>;
    zoomLevel: number;
    panPosition: { x: number, y: number };
    isPanning: boolean;
    handlePositionChange: (id: string, position: { x: number, y: number }, bringToFront?: boolean) => void;
    updateImageDimensions: (id: string, dimensions: { width: number, height: number }) => void;
    updateImageRotation: (id: string, rotation: number) => void;
    removeImage: (id: string) => Promise<void>;
    bringToFront: (id: string) => void;
    duplicateImage: (id: string) => void;
}

export const BoardContent: React.FC<BoardContentProps> = ({
                                                              images,
                                                              zoomLevel,
                                                              panPosition,
                                                              isPanning,
                                                              handlePositionChange,
                                                              updateImageDimensions,
                                                              updateImageRotation,
                                                              removeImage,
                                                              bringToFront,
                                                              duplicateImage
                                                          }) => {
    return (
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
                        rotation={image.rotation}
                        onPositionChange={handlePositionChange}
                        onDimensionsChange={updateImageDimensions}
                        onRotationChange={updateImageRotation}
                        onRemove={removeImage}
                        onBringToFront={bringToFront}
                        onDuplicate={duplicateImage}
                    />
                ))}
            </motion.div>
        </div>
    );
};
