import React from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { SketchPicker } from 'react-color';

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
                    className="fixed bottom-8 left-8 rounded-full h-14 w-14 shadow-lg"
                    size="icon"
                >
                    <Palette className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-transparent border-0 shadow-none">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        {predefinedColors.map((color) => (
                            <button
                                key={color}
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: color }}
                                onClick={() => onPredefinedColorClick(color)}
                            />
                        ))}
                        {/* Rainbow gradient button with softer pastel colors */}
                        <button
                            key="rainbow"
                            className="w-8 h-8 rounded-full overflow-hidden"
                            style={{
                                background: 'linear-gradient(to right, #ffd6da, #ffefd6, #ffffd6, #e3ffd6, #d6f0ff, #efe3ff)'
                            }}
                            onClick={() => onPredefinedColorClick('rainbow')}
                        />
                    </div>
                    <div style={{ boxShadow: 'none', border: 'none' }}>
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