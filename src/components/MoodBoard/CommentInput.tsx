import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { MessageSquare, Save, X, Edit3 } from 'lucide-react';

interface CommentInputProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (comment: string) => void;
    initialComment?: string;
    position: { x: number; y: number };
}

export const CommentInput: React.FC<CommentInputProps> = ({
    isOpen,
    onClose,
    onSave,
    initialComment = '',
    position
}) => {
    const [comment, setComment] = useState(initialComment);
    const [isEditing, setIsEditing] = useState(!initialComment);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
            // Set cursor to end of text
            textareaRef.current.setSelectionRange(comment.length, comment.length);
        }
    }, [isOpen, isEditing]);

    useEffect(() => {
        setComment(initialComment);
        setIsEditing(!initialComment);
    }, [initialComment, isOpen]);

    const handleSave = () => {
        onSave(comment.trim());
        setIsEditing(false);
        if (!comment.trim()) {
            onClose();
        }
    };

    const handleCancel = () => {
        setComment(initialComment);
        setIsEditing(false);
        if (!initialComment) {
            onClose();
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[300px] max-w-[400px]"
            style={{
                left: Math.min(position.x, window.innerWidth - 420),
                top: Math.min(position.y, window.innerHeight - 200),
                transform: position.x > window.innerWidth - 420 ? 'translateX(-100%)' : 'none'
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                        {isEditing ? 'Add Comment' : 'Image Comment'}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onClose}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="space-y-3">
                    <textarea
                        ref={textareaRef}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add your thoughts about this image..."
                        className="w-full min-h-[80px] p-3 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                            {comment.length}/500 • Ctrl+Enter to save
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                className="h-7 px-2 text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                className="h-7 px-2 text-xs bg-blue-500 hover:bg-blue-600"
                            >
                                <Save className="h-3 w-3 mr-1" />
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-md p-3 min-h-[60px]">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {comment || 'No comment added yet.'}
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="h-7 px-2 text-xs"
                        >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    </div>
                </div>
            )}

            {/* Fancy gradient border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-sm" />
        </motion.div>
    );
};