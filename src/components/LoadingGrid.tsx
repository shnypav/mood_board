import React from 'react';
import { ImageCardSkeleton } from './MoodBoard/ImageCard';

export const LoadingGrid: React.FC = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
            <ImageCardSkeleton key={index} />
        ))}
    </div>
);