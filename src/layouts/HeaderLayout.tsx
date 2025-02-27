import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const HeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { backgroundColor } = useTheme();

    return (
        <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
            {children}
        </div>
    );
};
