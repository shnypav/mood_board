import React, {useState} from 'react';
import {ChevronDown, Plus, Edit2, Trash2, FolderOpen, Palette} from 'lucide-react';
import {useBoards} from '../../contexts/BoardContext';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shadcn/components/ui/alert-dialog";
import {Button} from "@/shadcn/components/ui/button";
import {Input} from "@/shadcn/components/ui/input";
import {Label} from "@/shadcn/components/ui/label";

export const BoardManager = () => {
    const {boards, currentBoard, createBoard, deleteBoard, renameBoard, switchBoard} = useBoards();
    const {toast} = useToast();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState<string>('');
    const [newBoardName, setNewBoardName] = useState('');
    const [renameBoardName, setRenameBoardName] = useState('');

    const handleCreateBoard = () => {
        if (newBoardName.trim()) {
            const trimmedName = newBoardName.trim();
            createBoard(trimmedName);
            setNewBoardName('');
            setIsCreateDialogOpen(false);
            toast({
                title: "Board created",
                description: `"${trimmedName}" has been created and is now active.`,
                duration: 2000,
            });
        }
    };

    const handleRenameBoard = () => {
        if (renameBoardName.trim() && selectedBoardId) {
            
            const trimmedName = renameBoardName.trim();
            renameBoard(selectedBoardId, trimmedName);
            setRenameBoardName('');
            setSelectedBoardId('');
            setIsRenameDialogOpen(false);
            toast({
                title: "Board renamed",
                description: `Board has been renamed to "${trimmedName}".`,
                duration: 2000,
            });
        }
    };

    const handleDeleteBoard = () => {
        if (selectedBoardId && boards.length > 1) {
            const boardToDelete = boards.find(b => b.id === selectedBoardId);
            deleteBoard(selectedBoardId);
            setSelectedBoardId('');
            setIsDeleteDialogOpen(false);
            toast({
                title: "Board deleted",
                description: `"${boardToDelete?.name}" has been deleted.`,
                duration: 2000,
            });
        }
    };

    const openRenameDialog = (boardId: string, currentName: string) => {
        setSelectedBoardId(boardId);
        setRenameBoardName(currentName);
        setIsRenameDialogOpen(true);
    };

    const openDeleteDialog = (boardId: string) => {
        setSelectedBoardId(boardId);
        setIsDeleteDialogOpen(true);
    };

    const handleSwitchBoard = (boardId: string) => {
        switchBoard(boardId);
    };

    const getBoardColorIndicator = (backgroundColor: string) => {
        if (backgroundColor === 'rainbow') {
            return 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500';
        }
        return '';
    };

    return (
        <>
            <div className="absolute top-4 right-4 z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline"
                                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-lg">
                            <FolderOpen className="h-4 w-4"/>
                            <span className="max-w-32 truncate">
                                {currentBoard?.name || 'Select Board'}
                            </span>
                            {currentBoard && (
                                <div
                                    className={`w-3 h-3 rounded-full border border-gray-300 ${
                                        currentBoard.backgroundColor === 'rainbow'
                                            ? getBoardColorIndicator(currentBoard.backgroundColor)
                                            : ''
                                    }`}
                                    style={{
                                        backgroundColor: currentBoard.backgroundColor !== 'rainbow'
                                            ? currentBoard.backgroundColor
                                            : 'transparent'
                                    }}
                                />
                            )}
                            <ChevronDown className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel>Boards</DropdownMenuLabel>
                        <DropdownMenuSeparator/>

                        {boards.map((board) => (
                            <DropdownMenuItem
                                key={board.id}
                                className={`flex items-center justify-between ${
                                    board.id === currentBoard?.id ? 'bg-accent' : ''
                                }`}
                            >
                                <div
                                    className="flex-1 cursor-pointer flex items-center gap-2"
                                    onClick={() => handleSwitchBoard(board.id)}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full border border-gray-300 ${
                                            board.backgroundColor === 'rainbow'
                                                ? getBoardColorIndicator(board.backgroundColor)
                                                : ''
                                        }`}
                                        style={{
                                            backgroundColor: board.backgroundColor !== 'rainbow'
                                                ? board.backgroundColor
                                                : 'transparent'
                                        }}
                                    />
                                    <span className="font-medium truncate">{board.name}</span>
                                    {board.id === currentBoard?.id && (
                                        <span className="text-xs text-muted-foreground ml-2">• Current</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openRenameDialog(board.id, board.name);
                                        }}
                                    >
                                        <Edit2 className="h-3 w-3"/>
                                    </Button>
                                    {boards.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteDialog(board.id);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3"/>
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="flex items-center gap-2 text-blue-600 focus:text-blue-600"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4"/>
                            Create New Board
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Create Board Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Board</DialogTitle>
                        <DialogDescription>
                            Give your new mood board a name to get started. You can customize its background color after
                            creation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="board-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="board-name"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                placeholder="My Awesome Board"
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleCreateBoard();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                setNewBoardName('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateBoard}
                            disabled={!newBoardName.trim()}
                        >
                            Create Board
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Board Dialog */}
            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Board</DialogTitle>
                        <DialogDescription>
                            Enter a new name for this board.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rename-board" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="rename-board"
                                value={renameBoardName}
                                onChange={(e) => setRenameBoardName(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleRenameBoard();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRenameDialogOpen(false);
                                setRenameBoardName('');
                                setSelectedBoardId('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRenameBoard}
                            disabled={!renameBoardName.trim()}
                        >
                            Rename
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Board Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the board
                            "{boards.find(b => b.id === selectedBoardId)?.name}" and all its images.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setSelectedBoardId('');
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteBoard}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
