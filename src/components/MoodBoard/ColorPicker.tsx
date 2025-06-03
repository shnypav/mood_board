import React, { useState } from 'react';
import {Button} from '@/shadcn/components/ui/button';
import {Palette, ChevronDown} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '@/shadcn/components/ui/popover';
import {SketchPicker} from 'react-color';

interface ColorPickerProps {
    backgroundColor: string;
    onColorChange: (color: any) => void;
    predefinedColors: string[];
    onPredefinedColorClick: (color: string) => void;
}

// More comprehensive styles to remove all borders and shadows from SketchPicker
const sketchPickerStyles = {
    default: {
        picker: {
            boxShadow: 'none !important',
            border: 'none !important',
            borderRadius: '0 !important',
            background: 'transparent !important'
        },
        card: {
            boxShadow: 'none !important',
            border: 'none !important',
            borderRadius: '0 !important',
            background: 'transparent !important'
        }
    }
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
    backgroundColor,
    onColorChange,
    predefinedColors,
    onPredefinedColorClick
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="fixed bottom-8 left-8 rounded-full h-16 w-16 shadow-lg rainbow-button"
                    style={{
                        zIndex: 1000,
                        pointerEvents: 'auto'
                    }}
                    size="icon"
                >
                    <Palette className="h-7 w-7" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="bg-transparent border-0 shadow-none"
                style={{ zIndex: 1001 }}
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        {predefinedColors.map((color) => (
                            <button
                                key={color}
                                className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
                                style={{
                                    backgroundColor: color,
                                    pointerEvents: 'auto'
                                }}
                                onClick={() => onPredefinedColorClick(color)}
                            />
                        ))}
                        {/* Rainbow gradient button with softer pastel colors */}
                        <button
                            key="rainbow"
                            className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 transition-transform"
                            style={{
                                background: 'linear-gradient(to right, #ffd6da, #ffefd6, #ffffd6, #e3ffd6, #d6f0ff, #efe3ff)',
                                pointerEvents: 'auto'
                            }}
                            onClick={() => onPredefinedColorClick('rainbow')}
                        />
                    </div>
                    <div style={{
                        boxShadow: 'none',
                        border: 'none',
                        pointerEvents: 'auto'
                    }}>
                        <SketchPicker
                            color={backgroundColor !== 'rainbow' ? backgroundColor : '#ffffff'}
                            onChange={onColorChange}
                            disableAlpha
                            styles={sketchPickerStyles}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};