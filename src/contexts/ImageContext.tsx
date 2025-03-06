import React, { createContext, useContext, useState } from 'react';

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
    isLoading: boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading] = useState(false);
    const [maxZIndex, setMaxZIndex] = useState(1);

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

    return (
        <ImageContext.Provider value={{
            images,
            addImage,
            removeImage,
            updateImagePosition,
            bringToFront,
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