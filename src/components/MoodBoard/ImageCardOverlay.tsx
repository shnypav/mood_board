import React from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {Trash2, Copy} from 'lucide-react';

interface ImageCardOverlayProps {
    isRemoving: boolean;
    isDuplicating: boolean;
    handleRemove: (e: React.MouseEvent) => void;
    handleDuplicate: (e: React.MouseEvent) => void;
}

export const ImageCardOverlay: React.FC<ImageCardOverlayProps> = ({
                                                                      isRemoving,
                                                                      isDuplicating,
                                                                      handleRemove,
                                                                      handleDuplicate
                                                                  }) => {
    if (isRemoving) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
            >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
            </motion.div>
        );
    }

    if (isDuplicating) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className="absolute inset-0 bg-blue-500/50 rounded-lg flex items-center justify-center"
            >
                <div className="w-8 h-8 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"/>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2"
        >
            <Button
                variant="outline"
                size="icon"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                title="Duplicate Image"
                className="bg-blue-500 hover:bg-blue-600 text-white"
            >
                <Copy className="h-4 w-4"/>
            </Button>
            <Button
                variant="destructive"
                size="icon"
                onClick={handleRemove}
                disabled={isRemoving}
                title="Remove Image"
            >
                <Trash2 className="h-4 w-4"/>
            </Button>
        </motion.div>
    );
};