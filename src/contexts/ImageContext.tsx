import React, { createContext, useContext, useState, useEffect } from 'react';

interface Image {
    id: string;
    imageUrl: string;
    position?: { x: number, y: number };
    zIndex: number;
}

interface ImageContextType {
    images: Image[];
    addImage: (imageUrl: string) => void;
    removeImage: (id: string) => Promise<void>;
    updateImagePosition: (id: string, position: { x: number, y: number }) => void;
    bringToFront: (id: string) => void;
    clearAllImages: () => void;
    duplicateImage: (id: string) => void;
    isLoading: boolean;
}

const LOCAL_STORAGE_KEY = 'moodboard_images';
const LOCAL_STORAGE_MAX_Z_INDEX_KEY = 'moodboard_max_z_index';

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maxZIndex, setMaxZIndex] = useState(1);

    // Load images from localStorage on initial render
    useEffect(() => {
        const loadImages = async () => {
            try {
                const savedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
                const savedMaxZIndex = localStorage.getItem(LOCAL_STORAGE_MAX_Z_INDEX_KEY);

                if (savedImages) {
                    setImages(JSON.parse(savedImages));
                }

                if (savedMaxZIndex) {
                    setMaxZIndex(JSON.parse(savedMaxZIndex));
                }
            } catch (error) {
                console.error('Failed to load images from localStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImages();
    }, []);

    // Save images to localStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
            localStorage.setItem(LOCAL_STORAGE_MAX_Z_INDEX_KEY, JSON.stringify(maxZIndex));
        }
    }, [images, maxZIndex, isLoading]);

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

    const updateImagePosition = (id: string, position: { x: number, y: number }) => {
        // When updating position, also bring the image to front
        bringToFront(id);

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
            zIndex: newZIndex
        };

        setImages(prev => [...prev, newImage]);
    };

    const clearAllImages = () => {
        setImages([]);
        setMaxZIndex(1);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_MAX_Z_INDEX_KEY);
    };

    return (
        <ImageContext.Provider value={{
            images,
            addImage,
            removeImage,
            updateImagePosition,
            bringToFront,
            clearAllImages,
            duplicateImage,
            isLoading
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