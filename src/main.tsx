import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from '@/shadcn/components/ui/toaster'

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Failed to find the root element');
} else {
    try {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <App />
                <Toaster />
            </React.StrictMode>
        );
    } catch (error) {
        console.error('Failed to render the app:', error);
    }
}
