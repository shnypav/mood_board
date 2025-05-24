import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Board {
    id: string;
    name: string;
    backgroundColor: string;
    createdAt: Date;
    updatedAt: Date;
}

interface BoardContextType {
    boards: Board[];
    currentBoardId: string;
    currentBoard: Board | null;
    createBoard: (name: string, backgroundColor?: string) => string;
    deleteBoard: (id: string) => void;
    renameBoard: (id: string, newName: string) => void;
    switchBoard: (id: string) => void;
    updateBoardBackground: (id: string, backgroundColor: string) => void;
    isLoading: boolean;
}

const LOCAL_STORAGE_BOARDS_KEY = 'moodboard_boards';
const LOCAL_STORAGE_CURRENT_BOARD_KEY = 'moodboard_current_board';
const OLD_LOCAL_STORAGE_KEY = 'moodboard_images';
const OLD_LOCAL_STORAGE_MAX_Z_INDEX_KEY = 'moodboard_max_z_index';
const OLD_BACKGROUND_COLOR_KEY = 'moodboard_background_color';

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [currentBoardId, setCurrentBoardId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Migrate old single-board data to new multi-board system
    const migrateOldData = () => {
        const oldImages = localStorage.getItem(OLD_LOCAL_STORAGE_KEY);
        const oldMaxZIndex = localStorage.getItem(OLD_LOCAL_STORAGE_MAX_Z_INDEX_KEY);
        const oldBackgroundColor = localStorage.getItem(OLD_BACKGROUND_COLOR_KEY);
        
        if (oldImages || oldMaxZIndex || oldBackgroundColor) {
            // Create a default board for the migrated data
            const migratedBoard: Board = {
                id: 'migrated-' + Date.now().toString(),
                name: 'My Board',
                backgroundColor: oldBackgroundColor || '#ffffff',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Move old data to the new board-specific keys
            if (oldImages) {
                localStorage.setItem(`moodboard_images_${migratedBoard.id}`, oldImages);
                localStorage.removeItem(OLD_LOCAL_STORAGE_KEY);
            }
            
            if (oldMaxZIndex) {
                localStorage.setItem(`moodboard_max_z_index_${migratedBoard.id}`, oldMaxZIndex);
                localStorage.removeItem(OLD_LOCAL_STORAGE_MAX_Z_INDEX_KEY);
            }

            if (oldBackgroundColor) {
                localStorage.removeItem(OLD_BACKGROUND_COLOR_KEY);
            }
            
            return [migratedBoard];
        }
        
        return [];
    };

    // Initialize with default board if none exist
    useEffect(() => {
        const loadBoards = async () => {
            try {
                const savedBoards = localStorage.getItem(LOCAL_STORAGE_BOARDS_KEY);
                const savedCurrentBoardId = localStorage.getItem(LOCAL_STORAGE_CURRENT_BOARD_KEY);

                let loadedBoards: Board[] = [];
                
                if (savedBoards) {
                    loadedBoards = JSON.parse(savedBoards).map((board: any) => ({
                        ...board,
                        backgroundColor: board.backgroundColor || '#ffffff', // Default to white if missing
                        createdAt: new Date(board.createdAt),
                        updatedAt: new Date(board.updatedAt)
                    }));
                } else {
                    // Check for old data to migrate
                    const migratedBoards = migrateOldData();
                    if (migratedBoards.length > 0) {
                        loadedBoards = migratedBoards;
                    }
                }

                // If still no boards exist, create a default one
                if (loadedBoards.length === 0) {
                    const defaultBoard: Board = {
                        id: Date.now().toString(),
                        name: 'My First Board',
                        backgroundColor: '#ffffff',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    loadedBoards = [defaultBoard];
                    setCurrentBoardId(defaultBoard.id);
                } else {
                    // Set current board from saved data or default to first board
                    const currentId = savedCurrentBoardId && loadedBoards.find(b => b.id === savedCurrentBoardId) 
                        ? savedCurrentBoardId 
                        : loadedBoards[0].id;
                    setCurrentBoardId(currentId);
                }

                setBoards(loadedBoards);
            } catch (error) {
                console.error('Failed to load boards from localStorage:', error);
                // Create default board on error
                const defaultBoard: Board = {
                    id: Date.now().toString(),
                    name: 'My First Board',
                    backgroundColor: '#ffffff',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                setBoards([defaultBoard]);
                setCurrentBoardId(defaultBoard.id);
            } finally {
                setIsLoading(false);
            }
        };

        loadBoards();
    }, []);

    // Save boards to localStorage whenever they change
    useEffect(() => {
        if (!isLoading && boards.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_BOARDS_KEY, JSON.stringify(boards));
        }
    }, [boards, isLoading]);

    // Save current board ID to localStorage whenever it changes
    useEffect(() => {
        if (!isLoading && currentBoardId) {
            localStorage.setItem(LOCAL_STORAGE_CURRENT_BOARD_KEY, currentBoardId);
        }
    }, [currentBoardId, isLoading]);

    const createBoard = (name: string, backgroundColor: string = '#ffffff'): string => {
        const newBoard: Board = {
            id: Date.now().toString(),
            name,
            backgroundColor,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setBoards(prev => [...prev, newBoard]);
        setCurrentBoardId(newBoard.id);
        return newBoard.id;
    };

    const deleteBoard = (id: string) => {
        if (boards.length <= 1) {
            // Don't allow deleting the last board
            return;
        }

        setBoards(prev => prev.filter(board => board.id !== id));
        
        if (currentBoardId === id) {
            // Switch to first remaining board
            const remainingBoards = boards.filter(board => board.id !== id);
            if (remainingBoards.length > 0) {
                setCurrentBoardId(remainingBoards[0].id);
            }
        }

        // Clean up board-specific localStorage data
        localStorage.removeItem(`moodboard_images_${id}`);
        localStorage.removeItem(`moodboard_max_z_index_${id}`);
    };

    const renameBoard = (id: string, newName: string) => {
        setBoards(prev => 
            prev.map(board => 
                board.id === id 
                    ? { ...board, name: newName, updatedAt: new Date() }
                    : board
            )
        );
    };

    const updateBoardBackground = (id: string, backgroundColor: string) => {
        setBoards(prev => 
            prev.map(board => 
                board.id === id 
                    ? { ...board, backgroundColor, updatedAt: new Date() }
                    : board
            )
        );
    };

    const switchBoard = (id: string) => {
        const board = boards.find(b => b.id === id);
        if (board) {
            setCurrentBoardId(id);
        }
    };

    const currentBoard = boards.find(board => board.id === currentBoardId) || null;

    return (
        <BoardContext.Provider value={{
            boards,
            currentBoardId,
            currentBoard,
            createBoard,
            deleteBoard,
            renameBoard,
            switchBoard,
            updateBoardBackground,
            isLoading
        }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoards = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoards must be used within a BoardProvider');
    }
    return context;
}; 