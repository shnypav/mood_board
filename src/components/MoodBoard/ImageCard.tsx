import React, {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {Skeleton} from "@/shadcn/components/ui/skeleton";
import {useZoom} from '../../contexts/ZoomContext';
import {ResizeHandles} from './ResizeHandles';
import {RotationHandles} from './RotationHandles';
import {ImageCardOverlay} from './ImageCardOverlay';
import {CommentInput} from './CommentInput'; // 💬 Import comment component
import {useImageResize} from '../../hooks/useImageResize';
import {useImageRotation} from '../../hooks/useImageRotation';

export const ImageCardSkeleton: React.FC = () => (
    <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-lg"/>
    </div>
);

export const ImageCard: React.FC<{
    id: string;
    imageUrl: string;
    position?: { x: number, y: number };
    zIndex: number;
    width?: number;
    height?: number;
    rotation?: number;
    comment?: string; // 💬 Added comment prop
    onPositionChange: (id: string, position: { x: number, y: number }, bringToFront?: boolean) => void;
    onDimensionsChange: (id: string, dimensions: { width: number, height: number }) => void;
    onRotationChange: (id: string, rotation: number) => void;
    onCommentChange: (id: string, comment: string) => void; // 💬 Added comment change handler
    onRemove: (id: string) => Promise<void>;
    onBringToFront: (id: string) => void;
    onDuplicate: (id: string) => void;
}> = ({
          id,
          imageUrl,
          position,
          zIndex,
          width,
          height,
          rotation = 0,
          comment = '', // 💬 Added comment with default
          onPositionChange,
          onDimensionsChange,
          onRotationChange,
          onCommentChange, // 💬 Added comment change handler
          onRemove,
          onBringToFront,
          onDuplicate
      }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false); // 💬 Comment state
    const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 }); // 💬 Comment position
    const {toast} = useToast();
    const {zoomLevel} = useZoom();
    const startPositionRef = useRef({x: 0, y: 0});
    const originalPositionRef = useRef({x: 0, y: 0});
    const imageCardRef = useRef<HTMLDivElement>(null); // 💬 Ref for positioning

    // Initialize resize hook
    const {
        isResizing,
        dimensions,
        position: dragPosition,
        setPosition: setDragPosition,
        handleResizeStart,
        updateAspectRatio
    } = useImageResize({
        initialPosition: {x: position?.x || 0, y: position?.y || 0},
        initialDimensions: {
            width: width || 200, // Default width
            height: height || 200 // Default height
        },
        onPositionChange,
        onDimensionsChange,
        id
    });
    
    // Initialize rotation hook
    const {
        isRotating,
        rotation: currentRotation,
        handleRotationStart
    } = useImageRotation({
        id,
        initialRotation: rotation,
        onRotationChange,
        onBringToFront
    });

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsRemoving(true);
            await onRemove(id);
            // 🧹 Clean up saved comment position when image is removed
            localStorage.removeItem(`comment_position_${id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to remove image"
            });
            setIsRemoving(false);
        }
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsDuplicating(true);
            onDuplicate(id);
            // Show success toast
            toast({
                title: "Success",
                description: "Image duplicated successfully 🎉",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to duplicate image"
            });
        } finally {
            // Use setTimeout to provide visual feedback
            setTimeout(() => {
                setIsDuplicating(false);
            }, 300);
        }
    };

    // 💬 Handle comment button click
    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();

        // 🔄 Toggle comment dialog - close if already open
        if (isCommentOpen) {
            setIsCommentOpen(false);
            return;
        }

        // 💾 Try to load saved position first
        const savedPosition = localStorage.getItem(`comment_position_${id}`);
        let newPosition = { x: 0, y: 0 };

        if (savedPosition) {
            try {
                newPosition = JSON.parse(savedPosition);
                console.log(`📍 Loaded saved comment position for image ${id}:`, newPosition);
            } catch (error) {
                console.error('🚨 Failed to parse saved comment position:', error);
                // Fall back to default positioning
                if (imageCardRef.current) {
                    const rect = imageCardRef.current.getBoundingClientRect();
                    newPosition = {
                        x: rect.right + 10, // Position to the right of the image
                        y: rect.top
                    };
                }
            }
        } else {
            // 🎯 Default positioning if no saved position
            if (imageCardRef.current) {
                const rect = imageCardRef.current.getBoundingClientRect();
                newPosition = {
                    x: rect.right + 10, // Position to the right of the image
                    y: rect.top
                };
            }
        }

        setCommentPosition(newPosition);
        setIsCommentOpen(true);
        onBringToFront(id); // Bring image to front when commenting
    };

    // 💬 Handle comment save
    const handleCommentSave = (newComment: string) => {
        onCommentChange(id, newComment);
        toast({
            title: "Comment saved! 💬",
            description: newComment ? "Your comment has been added to the image." : "Comment removed from image.",
            duration: 2000,
        });

        if (!newComment) {
            setIsCommentOpen(false);
            // 🧹 Clean up saved position if comment is removed
            localStorage.removeItem(`comment_position_${id}`);
        }
    };

    // 💬 Handle comment close
    const handleCommentClose = () => {
        setIsCommentOpen(false);
    };

    // 💾 Handle comment position change
    const handleCommentPositionChange = (newPosition: { x: number; y: number }) => {
        setCommentPosition(newPosition);
        // Position is automatically saved in CommentInput component
    };

    const handleDragStart = () => {
        setIsDragging(true);
        onBringToFront(id);
        // Store the starting position for this drag operation
        startPositionRef.current = {...dragPosition};
        originalPositionRef.current = {...dragPosition};
    };

    const handleDragEnd = (event: any, info: any) => {
        setIsDragging(false);
        // Calculate the new position based on the starting position and the offset
        // adjusted by the zoom level
        const newPosition = {
            x: startPositionRef.current.x + (info.offset.x / zoomLevel),
            y: startPositionRef.current.y + (info.offset.y / zoomLevel)
        };
        setDragPosition(newPosition);
        // When drag ends, we do want to bring the image to front
        onPositionChange(id, newPosition, true);
    };

    // Bring image to front when clicked
    const handleClick = () => {
        onBringToFront(id);
    };

    // Load and update the image's natural dimensions
    useEffect(() => {
        if (!isLoading && (!width || !height)) {
            const img = new Image();
            img.onload = () => {
                // Calculate the aspect ratio
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                updateAspectRatio(aspectRatio);

                // Set initial dimensions while maintaining aspect ratio
                const newDimensions = {
                    width: 200, // Default width
                    height: 200 / aspectRatio
                };

                onDimensionsChange(id, newDimensions);
            };
            img.src = imageUrl;
        } else if (width && height) {
            updateAspectRatio(width / height);
        }
    }, [isLoading, width, height, imageUrl, id, onDimensionsChange]);

    return (
        <>
            <motion.div
                ref={imageCardRef} // 💬 Added ref for positioning
                initial={{opacity: 0}}
                animate={{
                    opacity: 1,
                    x: dragPosition.x,
                    y: dragPosition.y,
                    rotate: currentRotation
                }}
                exit={{opacity: 0}}
                className="relative group absolute image-card" // 🎯 Added image-card class for detection
                drag={!isResizing && !isRotating} // 🚀 FIXED: Allow drag even when comment is open!
                dragMomentum={false}
                dragElastic={0}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    zIndex: (isDragging || isResizing || isRotating || isCommentOpen) ? zIndex + 1000 : zIndex, // 💬 Extra boost when comment is open
                    touchAction: "none",
                    left: 0,
                    top: 0,
                    transform: `translate(0, 0) rotate(${currentRotation}deg)` // Add rotation to the transform
                }}
                data-image-element="true" // 🎯 Mark as image element for board interaction detection
            >

                {/* 💬 Comment indicator - show small icon when image has comment */}
                {comment && !isHovered && (
                    <div className="absolute top-2 right-2 z-20 bg-green-500 text-white rounded-full p-1 shadow-lg">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 flex items-center justify-center"
                        >
                            💬
                        </motion.div>
                    </div>
                )}

                <img
                    src={imageUrl}
                    alt="Mood board image"
                    className={`w-full h-full object-cover rounded-lg transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'} cursor-move`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
                <AnimatePresence>
                    {isHovered && !isRemoving && !isDuplicating && !isDragging && !isResizing && (
                        <ImageCardOverlay
                            isRemoving={isRemoving}
                            isDuplicating={isDuplicating}
                            hasComment={!!comment} // 💬 Pass comment status
                            handleRemove={handleRemove}
                            handleDuplicate={handleDuplicate}
                            handleComment={handleComment} // 💬 Pass comment handler
                        />
                    )}
                    {isRemoving && (
                        <ImageCardOverlay
                            isRemoving={isRemoving}
                            isDuplicating={isDuplicating}
                            hasComment={!!comment}
                            handleRemove={handleRemove}
                            handleDuplicate={handleDuplicate}
                            handleComment={handleComment}
                        />
                    )}
                    {isDuplicating && (
                        <ImageCardOverlay
                            isRemoving={isRemoving}
                            isDuplicating={isDuplicating}
                            hasComment={!!comment}
                            handleRemove={handleRemove}
                            handleDuplicate={handleDuplicate}
                            handleComment={handleComment}
                        />
                    )}

                    {/* Resize handles - only show when hovering and not dragging/removing/duplicating */}
                    {(isHovered || isResizing) && !isDragging && !isRemoving && !isDuplicating && (
                        <ResizeHandles handleResizeStart={handleResizeStart}/>
                    )}

                    {/* Rotation handles - only show when hovering and not dragging/removing/duplicating */}
                    {(isHovered || isRotating) && !isDragging && !isRemoving && !isDuplicating && (
                        <RotationHandles handleRotationStart={handleRotationStart}/>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 💬 Comment Input Component */}
            <AnimatePresence>
                {isCommentOpen && (
                    <CommentInput
                        isOpen={isCommentOpen}
                        onClose={handleCommentClose}
                        onSave={handleCommentSave}
                        onPositionChange={handleCommentPositionChange} // 💾 Pass position change handler
                        initialComment={comment}
                        position={commentPosition}
                        imageId={id} // 🆔 Pass image ID for position storage
                    />
                )}
            </AnimatePresence>
        </>
    );
};