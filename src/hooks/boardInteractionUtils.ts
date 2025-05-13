// Extend the Window interface to include our custom properties
declare global {
    interface Window {
        panIndicatorTimeout: ReturnType<typeof setTimeout> | null;
        zoomIndicatorTimeout: ReturnType<typeof setTimeout> | null;
    }
}

// Initialize the timeout properties if needed
if (typeof window !== 'undefined') {
    window.panIndicatorTimeout = window.panIndicatorTimeout || null;
    window.zoomIndicatorTimeout = window.zoomIndicatorTimeout || null;
}

export {}; // This file is a module