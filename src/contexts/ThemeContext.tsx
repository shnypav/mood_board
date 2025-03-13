import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const BACKGROUND_COLOR_KEY = 'moodboard-background-color';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState(() => {
        try {
            // Try to get the color from localStorage during initial load
            const savedColor = localStorage.getItem(BACKGROUND_COLOR_KEY);
            return savedColor && savedColor !== 'undefined' ? savedColor : '#ffffff';
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return '#ffffff';
        }
    });

    useEffect(() => {
        try {
            // Sync with localStorage whenever backgroundColor changes
            if (backgroundColor) {
                localStorage.setItem(BACKGROUND_COLOR_KEY, backgroundColor);
            }
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [backgroundColor]);

    const handleSetBackgroundColor = (color: string) => {
        if (color) {
            setBackgroundColor(color);
        }
    };

    return (
        <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor: handleSetBackgroundColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};