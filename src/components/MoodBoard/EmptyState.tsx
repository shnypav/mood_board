import React from 'react';
import {motion} from 'framer-motion';
import {Button} from '@/shadcn/components/ui/button';
import {ImagePlus} from 'lucide-react';

interface EmptyStateProps {
    onAddImage: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddImage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="mb-6">
        <img 
          src="/assets/empty-board.svg" 
          alt="Empty mood board" 
          className="w-32 h-32 mx-auto opacity-50"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Your mood board is empty
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md">
        Start building your visual inspiration by adding images, colors, and ideas to your board.
      </p>
      
      <button
        onClick={onAddImage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Your First Image
      </button>
    </div>
  );
};