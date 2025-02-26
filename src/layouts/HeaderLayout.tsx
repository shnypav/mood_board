import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const HeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { backgroundColor } = useTheme();

    return (
        <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor }}>
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Mood Board</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
