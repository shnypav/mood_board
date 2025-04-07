import React, { createContext, useContext, useState, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

interface ZoomContextType {
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    panPosition: Position;
    setPanPosition: (position: Position) => void;
    resetPanPosition: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

const ZOOM_LEVEL_KEY = 'moodboard-zoom-level';
const PAN_POSITION_KEY = 'moodboard-pan-position';
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;
const DEFAULT_PAN: Position = { x: 0, y: 0 };

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

    const [panPosition, setPanPosition] = useState<Position>(() => {
        try {
            // Try to get the pan position from localStorage during initial load
            const savedPan = localStorage.getItem(PAN_POSITION_KEY);
            return savedPan && savedPan !== 'undefined' ? JSON.parse(savedPan) : DEFAULT_PAN;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return DEFAULT_PAN;
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

    useEffect(() => {
        try {
            // Sync with localStorage whenever panPosition changes
            localStorage.setItem(PAN_POSITION_KEY, JSON.stringify(panPosition));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [panPosition]);

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

    const handleSetPanPosition = (position: Position) => {
        setPanPosition(position);
    };

    const resetPanPosition = () => {
        setPanPosition(DEFAULT_PAN);
    };

    return (
        <ZoomContext.Provider value={{
            zoomLevel,
            setZoomLevel: handleSetZoomLevel,
            zoomIn,
            zoomOut,
            panPosition,
            setPanPosition: handleSetPanPosition,
            resetPanPosition
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