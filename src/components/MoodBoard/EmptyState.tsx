import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { ImageIcon } from 'lucide-react';

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddImage }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
      <div className="mb-8 pointer-events-auto">
        <svg
          className="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">Your mood board is empty</h2>
        <p className="text-gray-600 mb-6">
          Start building your mood board by adding your first image
        </p>
        <button
          onClick={onAddImage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Add Your First Image
        </button>
      </div>
    </div>
  );
};