import React from 'react';
import { Image } from 'lucide-react';
import { BaseFileUpload, BaseFileUploadProps } from './BaseFileUpload';

type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/gif';

export const ImageFileUpload: React.FC<Omit<BaseFileUploadProps, 'validation' | 'title' | 'description' | 'icon' | 'accept'>> = ({
                                                                                                                                     onUploadSuccess,
                                                                                                                                     onUploadError,
                                                                                                                                     uploadFunction,
                                                                                                                                 }) => {
    const allowedTypes: ImageMimeType[] = ['image/jpeg', 'image/png', 'image/gif'];

    const formatAllowedTypes = () => {
        return allowedTypes
            .map(type => type.split('/')[1].toUpperCase())
            .join(', ');
    };

    const handleUpload = (base64WithMimeType: string, type: string) => {
        if (!allowedTypes.includes(type as ImageMimeType)) {
            throw new Error('Invalid image type');
        }
        return uploadFunction(base64WithMimeType, type as ImageMimeType);
    };

    return (
        <BaseFileUpload
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
            uploadFunction={handleUpload}
            validation={{
                maxSize: 50, // 50MB
                allowedTypes,
            }}
            title="Drop your image here"
            description={`or click to browse (${formatAllowedTypes()}, max 50MB)`}
            icon={<Image className="mx-auto h-12 w-12 text-muted-foreground" />}
            accept={allowedTypes.join(',')}
        />
    );
};
