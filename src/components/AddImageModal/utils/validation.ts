import { ImageValidationResult } from '../types';

/**
 * Validates if a file is a valid image file
 */
export const validateImageFile = (file: File): ImageValidationResult => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please select an image file (PNG, JPG, GIF, WebP)'
    };
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  return { isValid: true };
};

/**
 * Validates if a URL is a valid image URL format
 */
export const validateImageUrl = (url: string): ImageValidationResult => {
  if (!url.trim()) {
    return {
      isValid: false,
      error: 'Please enter an image URL'
    };
  }

  try {
    new URL(url.trim());
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
};

/**
 * Tests if an image URL can be loaded
 */
export const testImageUrl = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    
    img.src = url;
  });
};

/**
 * Checks if dropped files contain any image files
 */
export const findImageFile = (files: FileList): File | null => {
  return Array.from(files).find(file => file.type.startsWith('image/')) || null;
};
