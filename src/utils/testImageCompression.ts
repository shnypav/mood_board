/**
 * Test script to verify image compression functionality
 * Can be run in browser console
 */

import { compressImage, getDataUrlSize, formatBytes, checkStorageQuota } from './imageCompression';

export async function testImageCompression() {
    console.log('🧪 Testing image compression functionality...');
    
    // Create a test canvas with a simple image
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        console.error('❌ Canvas context not available');
        return;
    }
    
    // Draw a test pattern
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(1000, 0, 1000, 1000);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 1000, 1000, 1000);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(1000, 1000, 1000, 1000);
    
    // Convert to data URL
    const originalDataUrl = canvas.toDataURL('image/png');
    const originalSize = getDataUrlSize(originalDataUrl);
    
    console.log(`📏 Original image size: ${formatBytes(originalSize)}`);
    
    try {
        // Test compression
        const compressedDataUrl = await compressImage(originalDataUrl, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
            format: 'jpeg'
        });
        
        const compressedSize = getDataUrlSize(compressedDataUrl);
        const compressionRatio = Math.round((1 - compressedSize/originalSize) * 100);
        
        console.log(`📉 Compressed image size: ${formatBytes(compressedSize)}`);
        console.log(`🎯 Compression ratio: ${compressionRatio}% reduction`);
        
        // Test storage quota check
        const canStore = checkStorageQuota(compressedDataUrl);
        console.log(`💾 Can store in localStorage: ${canStore ? '✅ Yes' : '❌ No'}`);
        
        console.log('✅ Image compression test completed successfully!');
        
        return {
            originalSize,
            compressedSize,
            compressionRatio,
            canStore
        };
        
    } catch (error) {
        console.error('❌ Image compression test failed:', error);
        throw error;
    }
}

// Export for use in browser console
(window as any).testImageCompression = testImageCompression;