import React from 'react';
import {Button} from '@/shadcn/components/ui/button';
import {Plus} from 'lucide-react';

interface AddImageButtonProps {
    onClick: () => void; // 🔧 Fixed prop name from handleOpenModal to onClick
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({onClick}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚀 AddImageButton clicked!'); // 🐛 Debug log
        onClick();
    };

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2" style={{zIndex: 9999}}>
            <Button
                className="rounded-full h-16 w-16 shadow-lg rainbow-button"
                onClick={handleClick} // 🔧 Updated to use debug handler
                size="icon"
                title="Add Image (Ctrl+N)"
                style={{zIndex: 9999, position: 'relative'}}
            >
                <Plus className="h-7 w-7"/>
            </Button>
        </div>
    );
};