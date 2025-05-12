import {useState, useRef, useEffect} from 'react';
import {useZoom} from '../contexts/ZoomContext';

interface Position {
    x: number;
    y: number;
}

interface UseImageRotationProps {
    id: string;
    initialRotation: number;
    onRotationChange: (id: string, rotation: number) => void;
    onBringToFront: (id: string) => void;
}

export const useImageRotation = ({
                                     id,
                                     initialRotation,
                                     onRotationChange,
                                     onBringToFront
                                 }: UseImageRotationProps) => {
    const [isRotating, setIsRotating] = useState(false);
    const [rotation, setRotation] = useState(initialRotation || 0);
    const {zoomLevel} = useZoom();

    const startRotationRef = useRef(0);
    const startAngleRef = useRef(0);
    const elementCenterRef = useRef<Position>({x: 0, y: 0});

    // Handle rotation start
    const handleRotationStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsRotating(true);
        onBringToFront(id);

        // Get the element's bounding rectangle
        const element = e.currentTarget.parentElement;
        if (!element) return;

        const rect = element.getBoundingClientRect();

        // Calculate the center of the element
        elementCenterRef.current = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        // Calculate the initial angle between the mouse and the center
        const initialAngle = Math.atan2(
            e.clientY - elementCenterRef.current.y,
            e.clientX - elementCenterRef.current.x
        ) * (180 / Math.PI);

        startAngleRef.current = initialAngle;
        startRotationRef.current = rotation;
    };

    // Handle rotation move
    const handleRotation = (e: MouseEvent) => {
        if (!isRotating) return;

        // Calculate the current angle between the mouse and the center
        const currentAngle = Math.atan2(
            e.clientY - elementCenterRef.current.y,
            e.clientX - elementCenterRef.current.x
        ) * (180 / Math.PI);

        // Calculate the angle difference
        let angleDiff = currentAngle - startAngleRef.current;

        // Snap to 45-degree increments if Shift key is pressed
        if (e.shiftKey) {
            angleDiff = Math.round(angleDiff / 45) * 45;
        }

        // Calculate the new rotation
        const newRotation = startRotationRef.current + angleDiff;

        // Update the rotation state
        setRotation(newRotation);
    };

    // Handle rotation end
    const handleRotationEnd = () => {
        if (isRotating) {
            setIsRotating(false);
            // Save the final rotation to context
            onRotationChange(id, rotation);
        }
    };

    // Add and remove document event listeners for rotation
    useEffect(() => {
        if (isRotating) {
            document.addEventListener('mousemove', handleRotation);
            document.addEventListener('mouseup', handleRotationEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleRotation);
            document.removeEventListener('mouseup', handleRotationEnd);
        };
    }, [isRotating, rotation]);

    return {
        isRotating,
        rotation,
        setRotation,
        handleRotationStart,
        handleRotationEnd
    };
};