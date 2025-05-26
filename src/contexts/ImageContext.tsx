import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBoards } from './BoardContext';

interface Image {
    id: string;
    imageUrl: string;
    position?: { x: number, y: number };
    zIndex: number;
    width?: number;
    height?: number;
    rotation?: number;
    comment?: string; // 💬 Added comment field
}
interface ImageContextType {
    images: Image[];
    addImage: (imageUrl: string) => void;
    removeImage: (id: string) => Promise<void>;
    updateImagePosition: (id: string, position: { x: number, y: number }, bringToFrontFlag?: boolean) => void;
    updateImageDimensions: (id: string, dimensions: { width: number, height: number }) => void;
    updateImageRotation: (id: string, rotation: number) => void;
    updateImageComment: (id: string, comment: string) => void; // 💬 Added comment update function
    bringToFront: (id: string) => void;
    clearAllImages: () => void;
    duplicateImage: (id: string) => void;
    isLoading: boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maxZIndex, setMaxZIndex] = useState(1);
    const { currentBoardId, isLoading: boardsLoading } = useBoards();

    // Get board-specific storage keys
    const getStorageKeys = (boardId: string) => ({
        imagesKey: `moodboard_images_${boardId}`,
        maxZIndexKey: `moodboard_max_z_index_${boardId}`
    });

    // Load images from localStorage when current board changes
    useEffect(() => {
        if (boardsLoading || !currentBoardId) {
            return;
        }

        const loadImages = async () => {
            setIsLoading(true);
            try {
                const { imagesKey, maxZIndexKey } = getStorageKeys(currentBoardId);
                const savedImages = localStorage.getItem(imagesKey);
                const savedMaxZIndex = localStorage.getItem(maxZIndexKey);

                if (savedImages) {
                    setImages(JSON.parse(savedImages));
                } else {
                    setImages([]);
                }

                if (savedMaxZIndex) {
                    setMaxZIndex(JSON.parse(savedMaxZIndex));
                } else {
                    setMaxZIndex(1);
                }
            } catch (error) {
                console.error('Failed to load images from localStorage:', error);
                setImages([]);
                setMaxZIndex(1);
            } finally {
                setIsLoading(false);
            }
        };

        loadImages();
    }, [currentBoardId, boardsLoading]);

    // Save images to localStorage whenever they change
    useEffect(() => {
        if (!isLoading && !boardsLoading && currentBoardId) {
            const { imagesKey, maxZIndexKey } = getStorageKeys(currentBoardId);
            localStorage.setItem(imagesKey, JSON.stringify(images));
            localStorage.setItem(maxZIndexKey, JSON.stringify(maxZIndex));
        }
    }, [images, maxZIndex, isLoading, currentBoardId, boardsLoading]);

    const addImage = (imageUrl: string) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);

        const newImage: Image = {
            id: Date.now().toString(),
            imageUrl,
            zIndex: newZIndex
        };
        setImages(prev => [...prev, newImage]);
    };

    const removeImage = async (id: string) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };

    const updateImagePosition = (id: string, position: { x: number, y: number }, bringToFrontFlag: boolean = true) => {
        // Only bring to front if explicitly requested (e.g., for dragging, not for resizing)
        if (bringToFrontFlag) {
            bringToFront(id);
        }

        setImages(prev =>
            prev.map(image =>
                image.id === id ? { ...image, position } : image
            )
        );
    };

    const bringToFront = (id: string) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);

        setImages(prev =>
            prev.map(image =>
                image.id === id ? { ...image, zIndex: newZIndex } : image
            )
        );
    };

    const duplicateImage = (id: string) => {
        const originalImage = images.find(image => image.id === id);
        
        if (!originalImage) return;
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        // Define offset for the duplicated image
        const offset = { x: 20, y: 20 };
        const newPosition = originalImage.position 
            ? { 
                x: originalImage.position.x + offset.x, 
                y: originalImage.position.y + offset.y 
              } 
            : { x: offset.x, y: offset.y };
        const newImage: Image = {
            id: Date.now().toString(),
            imageUrl: originalImage.imageUrl,
            position: newPosition,
            zIndex: newZIndex,
            width: originalImage.width,
            height: originalImage.height,
            rotation: originalImage.rotation,
            comment: originalImage.comment // 💬 Copy comment when duplicating
        };
        setImages(prev => [...prev, newImage]);
    };

    const updateImageDimensions = (id: string, dimensions: { width: number, height: number }) => {
        setImages(prev =>
            prev.map(image =>
                image.id === id ? { ...image, width: dimensions.width, height: dimensions.height } : image
            )
        );
    };
    
    const updateImageRotation = (id: string, rotation: number) => {
        setImages(prev =>
            prev.map(image =>
                image.id === id ? { ...image, rotation } : image
            )
        );
    };

    // 💬 New function to update image comments
    const updateImageComment = (id: string, comment: string) => {
        setImages(prev =>
            prev.map(image =>
                image.id === id ? { ...image, comment } : image
            )
        );
    };
    
    const clearAllImages = () => {
        setImages([]);
        setMaxZIndex(1);
        if (currentBoardId) {
            const { imagesKey, maxZIndexKey } = getStorageKeys(currentBoardId);
            localStorage.removeItem(imagesKey);
            localStorage.removeItem(maxZIndexKey);
        }
    };

    return (
        <ImageContext.Provider value={{
            images,
            addImage,
            removeImage,
            updateImagePosition,
            updateImageDimensions,
            updateImageRotation,
            updateImageComment, // 💬 Added to context
            bringToFront,
            clearAllImages,
            duplicateImage,
            isLoading: isLoading || boardsLoading
        }}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImages = () => {
    const context = useContext(ImageContext);
    if (context === undefined) {
        throw new Error('useImages must be used within an ImageProvider');
    }
    return context;
};