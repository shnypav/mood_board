import { useCallback, useRef } from 'react';
import { BoardPosition } from '../types/board';

interface UseBoardInteractionsProps {
  boardPosition: BoardPosition;
  setBoardPosition: (position: BoardPosition) => void;
  zoom: number;
}

export const useBoardInteractions = ({
  boardPosition,
  setBoardPosition,
  zoom,
}: UseBoardInteractionsProps) => {
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 🎯 Only start board panning if clicking on empty space (not on images or comments)
    const target = e.target as HTMLElement;
    
    // 🚫 Don't pan if clicking on an image, image controls, or comment widget
    if (target.closest('.image-card') || 
        target.closest('[data-image-element]') ||
        target.closest('.comment-widget') || // 💬 Added comment widget detection
        target.closest('[data-comment-element]') || // 💬 Added comment element detection
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('textarea') ||
        target.closest('input')) { // 🚀 Added input elements
      return;
    }

    // 🚀 CRITICAL: Check if event was already handled by child elements
    if (e.defaultPrevented) {
      return;
    }

    // ✅ Start board panning for empty space clicks
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 🌍 Handle board panning when dragging empty space
    if (!isDragging.current) return;

    // 🚀 CRITICAL: Check if event was already handled by child elements
    if (e.defaultPrevented) {
      return;
    }

    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;

    // 🔄 Update board position for infinite canvas effect
    setBoardPosition({
      x: boardPosition.x + deltaX / zoom,
      y: boardPosition.y + deltaY / zoom
    });

    lastPosition.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, [boardPosition, setBoardPosition, zoom]);

  const handleMouseUp = useCallback(() => {
    // 🛑 Stop board panning
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // 🔍 Keep zoom functionality - zoom happens in place
    // Note: Zoom logic is handled in ZoomContext, this just prevents default
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    isPanning: isDragging.current, // 📊 Export panning state
  };
};