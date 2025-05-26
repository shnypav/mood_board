import React from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {Trash2, Copy, MessageSquare} from 'lucide-react';

interface ImageCardOverlayProps {
    isRemoving: boolean;
    isDuplicating: boolean;
    hasComment?: boolean; // 💬 Added to show if image has comment
    handleRemove: (e: React.MouseEvent) => void;
    handleDuplicate: (e: React.MouseEvent) => void;
    handleComment: (e: React.MouseEvent) => void; // 💬 Added comment handler
}

export const ImageCardOverlay: React.FC<ImageCardOverlayProps> = ({
                                                                      isRemoving,
                                                                      isDuplicating,
                                                                      hasComment = false,
                                                                      handleRemove,
                                                                      handleDuplicate,
                                                                      handleComment
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
            {/* 💬 Comment Button */}
            <Button
                variant="outline"
                size="icon"
                onClick={handleComment}
                title={hasComment ? "View/Edit Comment" : "Add Comment"}
                className={`${
                    hasComment
                        ? 'bg-green-500 hover:bg-green-600 text-white border-green-400'
                        : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-400'
                }`}
            >
                <MessageSquare className="h-4 w-4" />
                {hasComment && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                title="Duplicate Image"
                className="bg-blue-500 hover:bg-blue-600 text-white border-blue-400"
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