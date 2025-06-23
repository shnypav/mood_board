/**
 * Image compression utility to reduce file size before storing in localStorage
 */

export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    format: 'jpeg'
};

/**
 * Compresses an image to reduce its size while maintaining reasonable quality
 */
export async function compressImage(
    imageSource: string | File,
    options: CompressionOptions = {}
): Promise<string> {
    const config = { ...DEFAULT_OPTIONS, ...options };
    
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }
        
        img.onload = () => {
            try {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                const aspectRatio = width / height;
                
                if (width > config.maxWidth) {
                    width = config.maxWidth;
                    height = width / aspectRatio;
                }
                
                if (height > config.maxHeight) {
                    height = config.maxHeight;
                    width = height * aspectRatio;
                }
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress image
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed data URL
                const mimeType = config.format === 'png' ? 'image/png' : 
                               config.format === 'webp' ? 'image/webp' : 'image/jpeg';
                
                const compressedDataUrl = canvas.toDataURL(mimeType, config.quality);
                resolve(compressedDataUrl);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image for compression'));
        };
        
        // Load image from source
        if (typeof imageSource === 'string') {
            img.src = imageSource;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    img.src = e.target.result as string;
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(imageSource);
        }
    });
}

/**
 * Estimates the storage size of a data URL in bytes
 */
export function getDataUrlSize(dataUrl: string): number {
    // Remove data URL prefix to get just the base64 data
    const base64Data = dataUrl.split(',')[1] || '';
    
    // Calculate approximate size in bytes
    // Base64 encoding adds ~33% overhead, so we need to account for that
    const base64Length = base64Data.length;
    const padding = (base64Data.match(/=/g) || []).length;
    
    return (base64Length * 3 / 4) - padding;
}

/**
 * Checks if storing data would exceed localStorage quota
 */
export function checkStorageQuota(dataToStore: string, maxQuotaBytes: number = 5 * 1024 * 1024): boolean {
    try {
        // Get current localStorage usage
        let currentUsage = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                currentUsage += localStorage[key].length;
            }
        }
        
        const newDataSize = dataToStore.length;
        const totalSize = currentUsage + newDataSize;
        
        return totalSize <= maxQuotaBytes;
    } catch (error) {
        console.warn('Failed to check storage quota:', error);
        return false;
    }
}

/**
 * Formats bytes to human readable format
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}