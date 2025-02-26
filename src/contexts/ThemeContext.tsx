import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    return (
        <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor }}>
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
