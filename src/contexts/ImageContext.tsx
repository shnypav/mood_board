import React, { createContext, useContext, useState } from 'react';

interface Image {
    id: string;
    imageUrl: string;
}

interface ImageContextType {
    images: Image[];
    addImage: (imageUrl: string) => void;
    removeImage: (id: string) => Promise<void>;
    isLoading: boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [isLoading] = useState(false);

    const addImage = (imageUrl: string) => {
        const newImage: Image = {
            id: Date.now().toString(),
            imageUrl
        };
        setImages(prev => [...prev, newImage]);
    };

    const removeImage = async (id: string) => {
        setImages(prev => prev.filter(image => image.id !== id));
    };

    return (
        <ImageContext.Provider value={{ images, addImage, removeImage, isLoading }}>
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
