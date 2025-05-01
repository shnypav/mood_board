import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { ImageIcon } from 'lucide-react';

export const EmptyState: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
    >
        <img
            src="/assets/empty-board.svg"
            alt="Empty board"
            className="w-60 h-60 opacity-50"
        />
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Your mood board is empty</h2>
            <p className="text-muted-foreground mb-4">
                Add some images to get started with your inspiration collection
            </p>
            <Button
                onClick={onAddClick}
                size="lg"
                className="rainbow-button"
            >
                <ImageIcon className="mr-2 h-5 w-5" />
                Add First Image
            </Button>
        </div>
    </motion.div>
);