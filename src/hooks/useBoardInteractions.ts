import {useState, useEffect, useRef} from 'react';

interface UseBoardInteractionsProps {
    panPosition: { x: number, y: number };
    setPanPosition: (position: { x: number, y: number }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
}

export const useBoardInteractions = ({
                                         panPosition,
                                         setPanPosition,
                                         zoomIn,
                                         zoomOut
                                     }: UseBoardInteractionsProps) => {
    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({x: 0, y: 0});
    const [showZoomIndicator, setShowZoomIndicator] = useState(false);
    const [showPanIndicator, setShowPanIndicator] = useState(false);

    // Handle mouse events for panning
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left mouse button
            setIsPanning(true);
            setStartPanPosition({
                x: e.clientX - panPosition.x,
                y: e.clientY - panPosition.y
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const newX = e.clientX - startPanPosition.x;
            const newY = e.clientY - startPanPosition.y;
            setPanPosition({x: newX, y: newY});
            setShowPanIndicator(true);
            // Clear the timeout if it exists
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
            // Set a new timeout
            window.panIndicatorTimeout = setTimeout(() => {
                setShowPanIndicator(false);
            }, 1500);
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    // Handle touch events for panning
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsPanning(true);
            setStartPanPosition({
                x: e.touches[0].clientX - panPosition.x,
                y: e.touches[0].clientY - panPosition.y
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isPanning && e.touches.length === 1) {
            const newX = e.touches[0].clientX - startPanPosition.x;
            const newY = e.touches[0].clientY - startPanPosition.y;
            setPanPosition({x: newX, y: newY});
            setShowPanIndicator(true);
            // Clear the timeout if it exists
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
            // Set a new timeout
            window.panIndicatorTimeout = setTimeout(() => {
                setShowPanIndicator(false);
            }, 1500);
        }
    };

    const handleTouchEnd = () => {
        setIsPanning(false);
    };

    // Handle zoom changes
    const handleZoomChange = (zoomFunc: () => void) => () => {
        zoomFunc();
        setShowZoomIndicator(true);
        // Clear the timeout if it exists
        if (window.zoomIndicatorTimeout) {
            clearTimeout(window.zoomIndicatorTimeout);
        }
        // Set a new timeout
        window.zoomIndicatorTimeout = setTimeout(() => {
            setShowZoomIndicator(false);
        }, 1500);
    };

    // Handle keyboard panning
    const handleKeyboardPan = (direction: string) => () => {
        const panStep = 50; // pixels to move per click
        let newX = panPosition.x;
        let newY = panPosition.y;

        switch (direction) {
            case 'up':
                newY += panStep;
                break;
            case 'down':
                newY -= panStep;
                break;
            case 'left':
                newX += panStep;
                break;
            case 'right':
                newX -= panStep;
                break;
        }

        setPanPosition({x: newX, y: newY});
        setShowPanIndicator(true);
        // Clear the timeout if it exists
        if (window.panIndicatorTimeout) {
            clearTimeout(window.panIndicatorTimeout);
        }
        // Set a new timeout
        window.panIndicatorTimeout = setTimeout(() => {
            setShowPanIndicator(false);
        }, 1500);
    };

    // Reset pan position
    const handleResetPan = () => {
        setPanPosition({x: 0, y: 0});
        setShowPanIndicator(true);
        // Clear the timeout if it exists
        if (window.panIndicatorTimeout) {
            clearTimeout(window.panIndicatorTimeout);
        }
        // Set a new timeout
        window.panIndicatorTimeout = setTimeout(() => {
            setShowPanIndicator(false);
        }, 1500);
    };

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (window.zoomIndicatorTimeout) {
                clearTimeout(window.zoomIndicatorTimeout);
            }
            if (window.panIndicatorTimeout) {
                clearTimeout(window.panIndicatorTimeout);
            }
        };
    }, []);

    return {
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
    };
};