import React, { createContext, useContext, useState, useEffect } from 'react';

interface ZoomContextType {
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

const ZOOM_LEVEL_KEY = 'moodboard-zoom-level';
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [zoomLevel, setZoomLevel] = useState(() => {
        try {
            // Try to get the zoom level from localStorage during initial load
            const savedZoom = localStorage.getItem(ZOOM_LEVEL_KEY);
            return savedZoom && savedZoom !== 'undefined' ? parseFloat(savedZoom) : 1;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return 1;
        }
    });

    useEffect(() => {
        try {
            // Sync with localStorage whenever zoomLevel changes
            localStorage.setItem(ZOOM_LEVEL_KEY, zoomLevel.toString());
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [zoomLevel]);

    const handleSetZoomLevel = (level: number) => {
        // Ensure zoom level stays within bounds
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
        setZoomLevel(newZoom);
    };

    const zoomIn = () => {
        handleSetZoomLevel(zoomLevel + ZOOM_STEP);
    };

    const zoomOut = () => {
        handleSetZoomLevel(zoomLevel - ZOOM_STEP);
    };

    return (
        <ZoomContext.Provider value={{
            zoomLevel,
            setZoomLevel: handleSetZoomLevel,
            zoomIn,
            zoomOut
        }}>
            {children}
        </ZoomContext.Provider>
    );
};

export const useZoom = () => {
    const context = useContext(ZoomContext);
    if (context === undefined) {
        throw new Error('useZoom must be used within a ZoomProvider');
    }
    return context;
};