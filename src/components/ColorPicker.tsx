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
            <PopoverContent className="bg-transparent">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        {predefinedColors.map((color) => (
                            <button
                                key={color}
                                className="w-8 h-8 rounded-full border"
                                style={{ backgroundColor: color }}
                                onClick={() => onPredefinedColorClick(color)}
                            />
                        ))}
                    </div>
                    <SketchPicker
                        color={backgroundColor}
                        onChange={onColorChange}
                        disableAlpha
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};