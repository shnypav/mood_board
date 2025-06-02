import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { MessageSquare, Save, X, Edit3, Move } from 'lucide-react';

interface CommentInputProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (comment: string) => void;
    onPositionChange?: (position: { x: number; y: number }) => void; // 💾 Added position change callback
    initialComment?: string;
    position: { x: number; y: number };
    imageId?: string; // 🆔 Added image ID for position storage
}

export const CommentInput: React.FC<CommentInputProps> = ({
    isOpen,
    onClose,
    onSave,
    onPositionChange, // 💾 Position change handler
    initialComment = '',
    position,
    imageId // 🆔 Image ID for storage key
}) => {
    const [comment, setComment] = useState(initialComment);
    const [isEditing, setIsEditing] = useState(!initialComment);
    const [isDragging, setIsDragging] = useState(false); // 🚀 Dragging state
    const [dragPosition, setDragPosition] = useState(position); // 🎯 Current position
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const commentRef = useRef<HTMLDivElement>(null); // 🎯 Ref for drag detection

    // 💾 Load saved position from localStorage on mount
    useEffect(() => {
        if (imageId) {
            const savedPosition = localStorage.getItem(`comment_position_${imageId}`);
            if (savedPosition) {
                try {
                    const parsedPosition = JSON.parse(savedPosition);
                    setDragPosition(parsedPosition);
                    // 📢 Notify parent about loaded position
                    onPositionChange?.(parsedPosition);
                } catch (error) {
                    console.error('🚨 Failed to parse saved comment position:', error);
                    setDragPosition(position);
                }
            } else {
                setDragPosition(position);
            }
        } else {
            setDragPosition(position);
        }
    }, [imageId, position, onPositionChange]);

    // 🔄 Update position when prop changes (but not if we have a saved position)
    useEffect(() => {
        if (!imageId || !localStorage.getItem(`comment_position_${imageId}`)) {
            setDragPosition(position);
        }
    }, [position, imageId]);

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

    // 🔑 Enhanced ESC key listener with better event handling
    useEffect(() => {
        if (!isOpen) return;

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // 🎯 Only handle ESC key
            if (e.key === 'Escape') {
                console.log('🔑 ESC key detected in CommentInput!'); // 🐛 Debug log
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // 🛑 Stop all other ESC handlers
                handleCancel();
            }
        };

        // 🌍 Add multiple listeners for better coverage
        document.addEventListener('keydown', handleGlobalKeyDown, { capture: true, passive: false });
        window.addEventListener('keydown', handleGlobalKeyDown, { capture: true, passive: false });

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
            window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
        };
    }, [isOpen, initialComment]); // 🔄 Re-run when isOpen or initialComment changes

    const handleSave = () => {
        onSave(comment.trim());
        setIsEditing(false);
        if (!comment.trim()) {
            onClose();
        }
    };

    const handleCancel = () => {
        console.log('🚫 Canceling comment input...'); // 🐛 Debug log
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
        // 🛑 Stop propagation to prevent conflicts
        e.stopPropagation();

        if (e.key === 'Escape') {
            console.log('🔑 ESC in textarea!'); // 🐛 Debug log
            e.preventDefault();
            handleCancel();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSave();
        }
    };

    // 🚫 SMART CLICK OUTSIDE HANDLER - NO INTERFERENCE! 🚀
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            // 🚀 CRITICAL: Only close if we're NOT dragging and it's been a while since drag ended
            if (isDragging) {
                return; // Never close while dragging
            }

            const target = e.target as Element;

            // 🎯 Only close if clicking truly outside
            if (!target.closest('[data-comment-input]') &&
                !target.closest('.comment-widget') &&
                !target.closest('[data-comment-element]')) {

                // 🕐 Add a small delay to prevent immediate closing after drag
                setTimeout(() => {
                    if (!isDragging) { // Double check we're still not dragging
                        console.log('🖱️ Click outside detected after delay!'); // 🐛 Debug log
                        handleCancel();
                    }
                }, 50); // Very small delay
            }
        };

        // 🚀 Use capture: false and add delay to prevent interference
        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside, { capture: false });
        }, 100); // Small delay before activating click outside

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, { capture: false });
        };
    }, [isOpen, isDragging, handleCancel]); // 🚀 Added handleCancel dependency

    // 🚀 Manual drag handlers (like ImageCard) - ENHANCED VERSION!
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
    const [dragStartMousePos, setDragStartMousePos] = useState({ x: 0, y: 0 });
    const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null); // 🕐 Drag timeout

    const handleMouseDown = (e: React.MouseEvent) => {
        // 🆓 COMPLETELY UNRESTRICTED DRAGGING!
        // Only prevent if actively typing in textarea
        if (e.target === textareaRef.current && document.activeElement === textareaRef.current) {
            return; // Only prevent if actively typing
        }

        // 🚀 IMMEDIATE DRAG START - no delays or checks!
        setIsDragging(true);
        setDragStartPos(dragPosition);
        setDragStartMousePos({ x: e.clientX, y: e.clientY });

        // 🕐 Clear any existing timeout
        if (dragTimeout) {
            clearTimeout(dragTimeout);
            setDragTimeout(null);
        }

        // 🛑 CRITICAL: Prevent ALL event propagation immediately!
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        console.log('🚀 Comment drag started IMMEDIATELY!'); // 🐛 Debug log
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartMousePos.x;
        const deltaY = e.clientY - dragStartMousePos.y;

        const newPosition = {
            x: dragStartPos.x + deltaX,
            y: dragStartPos.y + deltaY
        };

        // 🌍 Remove screen bounds constraints - allow infinite movement like images!
        setDragPosition(newPosition);

        // 🛑 CRITICAL: Prevent ALL event propagation!
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isDragging) {
            // 💾 Save position to localStorage when drag ends
            if (imageId) {
                localStorage.setItem(`comment_position_${imageId}`, JSON.stringify(dragPosition));
                console.log(`💾 Saved comment position for image ${imageId}:`, dragPosition);
            }

            // 📢 Notify parent about position change
            onPositionChange?.(dragPosition);

            console.log('🛑 Comment drag ended!'); // 🐛 Debug log

            // 🕐 Set a timeout to prevent immediate click outside detection
            const timeout = setTimeout(() => {
                setIsDragging(false);
            }, 100); // Small delay before allowing click outside
            setDragTimeout(timeout);
        } else {
            setIsDragging(false);
        }

        // 🛑 CRITICAL: Prevent ALL event propagation!
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    // 🌍 Global mouse events for dragging (like ImageCard) - ENHANCED!
    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - dragStartMousePos.x;
            const deltaY = e.clientY - dragStartMousePos.y;

            const newPosition = {
                x: dragStartPos.x + deltaX,
                y: dragStartPos.y + deltaY
            };

            // 🌍 Remove screen bounds constraints - allow infinite movement!
            setDragPosition(newPosition);

            // 🛑 Prevent event propagation
            e.preventDefault();
            e.stopPropagation();
        };

        const handleGlobalMouseUp = (e: MouseEvent) => {
            if (isDragging) {
                // 💾 Save position to localStorage when drag ends
                if (imageId) {
                    localStorage.setItem(`comment_position_${imageId}`, JSON.stringify(dragPosition));
                    console.log(`💾 Saved comment position for image ${imageId}:`, dragPosition);
                }

                // 📢 Notify parent about position change
                onPositionChange?.(dragPosition);

                console.log('🛑 Global comment drag ended!'); // 🐛 Debug log

                // 🕐 Set a timeout to prevent immediate click outside detection
                const timeout = setTimeout(() => {
                    setIsDragging(false);
                }, 100); // Small delay before allowing click outside
                setDragTimeout(timeout);
            } else {
                setIsDragging(false);
            }

            // 🛑 Prevent event propagation
            e.preventDefault();
            e.stopPropagation();
        };

        // 🚀 CRITICAL: Use capture phase for global events to get them first!
        document.addEventListener('mousemove', handleGlobalMouseMove, { capture: true });
        document.addEventListener('mouseup', handleGlobalMouseUp, { capture: true });

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove, { capture: true });
            document.removeEventListener('mouseup', handleGlobalMouseUp, { capture: true });
        };
    }, [isDragging, dragStartPos, dragStartMousePos, dragPosition, imageId, onPositionChange]);

    // 🧹 Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (dragTimeout) {
                clearTimeout(dragTimeout);
            }
        };
    }, [dragTimeout]);

    if (!isOpen) return null;

    return (
        <motion.div
            ref={commentRef} // 🎯 Added ref for drag detection
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[300px] max-w-[400px] comment-widget ${
                isDragging ? 'cursor-grabbing shadow-3xl scale-105' : 'cursor-grab'
            }`}
            style={{
                left: dragPosition.x,
                top: dragPosition.y,
                userSelect: isDragging ? 'none' : 'auto' // 🚫 Prevent text selection while dragging
            }}
            onClick={(e) => {
                e.stopPropagation();
                console.log('💬 Comment widget clicked!'); // 🐛 Debug log
            }}
            onKeyDown={(e) => e.stopPropagation()} // 🛑 Prevent event bubbling
            onMouseDown={handleMouseDown} // 🚀 Manual drag start
            onMouseMove={handleMouseMove} // 🚀 Manual drag move
            onMouseUp={handleMouseUp} // 🚀 Manual drag end
            data-comment-input="true" // 🏷️ Marker for click outside detection
            data-comment-element="true" // 🎯 Mark as comment element for board interaction detection
        >
            {/* 🎯 Draggable Header - ALWAYS draggable! */}
            <div className="flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing drag-handle">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                        {isEditing ? 'Add Comment' : 'Image Comment'}
                    </span>
                    <Move className="h-3 w-3 text-gray-400" title="Drag to move" />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('❌ Close button clicked!'); // 🐛 Debug log
                        onClose();
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('❌ Close button mouse down!'); // 🐛 Debug log
                    }}
                    title="Close (ESC)" // 💡 Added hint about ESC key
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            {/* Content - NOW DRAGGABLE TOO! */}
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
                        onMouseDown={(e) => {
                            // 🚀 Allow text selection in textarea but prevent widget dragging
                            e.stopPropagation();
                        }}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                            {comment.length}/500 • Ctrl+Enter to save • ESC to cancel
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                className="h-7 px-2 text-xs"
                                title="Cancel (ESC)" // 💡 Added hint
                                onMouseDown={(e) => e.stopPropagation()} // 🚀 Prevent drag when clicking button
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                className="h-7 px-2 text-xs bg-blue-500 hover:bg-blue-600"
                                title="Save (Ctrl+Enter)" // 💡 Added hint
                                onMouseDown={(e) => e.stopPropagation()} // 🚀 Prevent drag when clicking button
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
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Move className="h-3 w-3" />
                            Drag anywhere to move
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="h-7 px-2 text-xs"
                            onMouseDown={(e) => e.stopPropagation()} // 🚀 Prevent drag when clicking button
                        >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    </div>
                </div>
            )}

            {/* 🌈 Enhanced gradient border with drag effect */}
            <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 -z-10 blur-sm transition-all duration-200 ${
                isDragging ? 'from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-md' : ''
            }`} />

            {/* 🎯 Drag indicator when dragging */}
            {isDragging && (
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-dashed border-blue-400 rounded-lg animate-pulse" />
            )}
        </motion.div>
    );
};