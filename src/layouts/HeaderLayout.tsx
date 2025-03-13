import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/rainbow.css';

export const HeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { backgroundColor } = useTheme();

    // Use the rainbow-background class for animated gradient
    const className = `min-h-screen transition-colors duration-200 ${backgroundColor === 'rainbow' ? 'rainbow-background' : ''}`;

    // Only set backgroundColor for non-rainbow colors
    const style = backgroundColor !== 'rainbow'
        ? { backgroundColor: backgroundColor || '#ffffff' }
        : {};

    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
};