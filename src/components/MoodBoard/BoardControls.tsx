import React from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/shadcn/components/ui/popover';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    MoveHorizontal,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Settings
} from 'lucide-react';

interface BoardControlsProps {
    zoomLevel: number;
    panPosition: { x: number, y: number };
    handleZoomChange: (zoomFunc: () => void) => () => void;
    zoomIn: () => void;
    zoomOut: () => void;
    handleKeyboardPan: (direction: string) => () => void;
    handleResetPan: () => void;
    handleClearAllImages: () => void;
    setIsClearConfirmOpen: (isOpen: boolean) => void;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
                                                                zoomLevel,
                                                                panPosition,
                                                                handleZoomChange,
                                                                zoomIn,
                                                                zoomOut,
                                                                handleKeyboardPan,
                                                                handleResetPan,
                                                                handleClearAllImages,
                                                                setIsClearConfirmOpen
                                                            }) => {
    return (
        <div className="fixed bottom-8 right-8" style={{zIndex: 9999}}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="rounded-full h-16 w-16 shadow-lg rainbow-button"
                        size="icon"
                        title="Board Controls"
                        style={{zIndex: 9999, position: 'relative'}}
                    >
                        <Settings className="h-7 w-7"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" side="top">
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.95}}
                        transition={{duration: 0.2}}
                        className="space-y-4"
                    >
                        <h4 className="font-medium mb-2">Board Controls</h4>
                        {/* Zoom Controls */}
                        <div className="space-y-2">
                            <h5 className="text-sm font-medium text-muted-foreground">Zoom</h5>
                            <div className="flex space-x-2">
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleZoomChange(zoomIn)}
                                    title="Zoom In (Cmd/Ctrl + Mouse Wheel Up)"
                                >
                                    <ZoomIn className="h-4 w-4"/>
                                </Button>
                                <div className="flex-1 flex items-center justify-center text-sm">
                                    {Math.round(zoomLevel * 100)}%
                                </div>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleZoomChange(zoomOut)}
                                    title="Zoom Out (Cmd/Ctrl + Mouse Wheel Down)"
                                >
                                    <ZoomOut className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                        {/* Pan Controls */}
                        <div className="space-y-2">
                            <h5 className="text-sm font-medium text-muted-foreground">Pan</h5>
                            <div className="grid grid-cols-3 gap-1">
                                <div></div>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleKeyboardPan('up')}
                                    title="Pan Up (Arrow Up)"
                                >
                                    <ArrowUp className="h-4 w-4"/>
                                </Button>
                                <div></div>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleKeyboardPan('left')}
                                    title="Pan Left (Arrow Left)"
                                >
                                    <ArrowLeft className="h-4 w-4"/>
                                </Button>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleResetPan}
                                    title="Reset Pan Position"
                                >
                                    <MoveHorizontal className="h-4 w-4"/>
                                </Button>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleKeyboardPan('right')}
                                    title="Pan Right (Arrow Right)"
                                >
                                    <ArrowRight className="h-4 w-4"/>
                                </Button>
                                <div></div>
                                <Button
                                    className="rounded-full h-10 w-10 shadow-sm rainbow-button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleKeyboardPan('down')}
                                    title="Pan Down (Arrow Down)"
                                >
                                    <ArrowDown className="h-4 w-4"/>
                                </Button>
                                <div></div>
                            </div>
                            <div className="text-xs text-center text-muted-foreground mt-1">
                                X: {Math.round(panPosition.x)}, Y: {Math.round(panPosition.y)}
                            </div>
                        </div>
                        {/* Clear All Button */}
                        <div className="pt-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        className="w-full rainbow-button"
                                        variant="outline"
                                        title="Clear All Images"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2"/> Clear All Images
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Clear all images?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            This will remove all images from your mood board. This action cannot be
                                            undone.
                                        </p>
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                className="rainbow-button"
                                                onClick={() => setIsClearConfirmOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="rainbow-button"
                                                onClick={handleClearAllImages}
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </motion.div>
                </PopoverContent>
            </Popover>
        </div>
    );
};