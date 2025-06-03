import React from 'react';
import {Button} from '@/shadcn/components/ui/button';
import {Plus} from 'lucide-react';

interface AddImageButtonProps {
    handleOpenModal: () => void;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({handleOpenModal}) => {
    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
                className="rounded-full h-16 w-16 shadow-lg rainbow-button"
                onClick={handleOpenModal}
                size="icon"
                title="Add Image (Ctrl+N)"
            >
                <Plus className="h-7 w-7"/>
            </Button>
        </div>
    );
};