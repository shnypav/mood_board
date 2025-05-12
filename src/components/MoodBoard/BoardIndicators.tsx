import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';

interface BoardIndicatorsProps {
    showZoomIndicator: boolean;
    showPanIndicator: boolean;
    zoomLevel: number;
    panPosition: { x: number, y: number };
}

export const BoardIndicators: React.FC<BoardIndicatorsProps> = ({
                                                                    showZoomIndicator,
                                                                    showPanIndicator,
                                                                    zoomLevel,
                                                                    panPosition
                                                                }) => {
    return (
        <>
            {/* Zoom indicator with animation */}
            <AnimatePresence>
                {showZoomIndicator && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
                        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-md shadow-sm text-xs"
                    >
                        Zoom: {Math.round(zoomLevel * 100)}%
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pan position indicator with animation */}
            <AnimatePresence>
                {showPanIndicator && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
                        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-md shadow-sm text-xs"
                    >
                        Pan: X: {Math.round(panPosition.x)}, Y: {Math.round(panPosition.y)}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};