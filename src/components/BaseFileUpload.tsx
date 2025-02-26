import React, { useState, useCallback, useRef } from 'react';
import { FileUp, AlertCircle } from 'lucide-react';
import { Card } from "@/shadcn/components/ui/card";
import { Progress } from "@/shadcn/components/ui/progress";
import { Alert, AlertDescription } from "@/shadcn/components/ui/alert";
import { motion } from "framer-motion";

export interface FileValidation {
    maxSize: number; // in MB
    allowedTypes: string[];
    customValidator?: (file: File) => string | null;
}

export type UploadFunction = (rawBase64Data: string, mimeType: string) => Promise<any>;

export interface BaseFileUploadProps {
    onUploadSuccess: (result: any) => void;
    onUploadError: (error: string) => void;
    uploadFunction: UploadFunction;
    validation: FileValidation;
    title: string;
    description: string;
    icon?: React.ReactNode;
    accept: string;
}

export const BaseFileUpload: React.FC<BaseFileUploadProps> = ({
                                                                  onUploadSuccess,
                                                                  onUploadError,
                                                                  uploadFunction,
                                                                  validation,
                                                                  title,
                                                                  description,
                                                                  icon = <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />,
                                                                  accept
                                                              }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const { maxSize, allowedTypes, customValidator } = validation;

        if (!allowedTypes.includes(file.type)) {
            return `Only ${allowedTypes.map(type => type.split('/')[1]).join(', ')} files are allowed`;
        }

        const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB

        if (fileSizeInMB > maxSize) {
            return `File size exceeds ${maxSize}MB limit`;
        }

        if (customValidator) {
            return customValidator(file);
        }

        return null;
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                onUploadError(validationError);
                return;
            }
            handleFileUpload(file);
        }
    }, [validation, onUploadError]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                onUploadError(validationError);
                return;
            }
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        setError(null);
        setUploadProgress(0);
        setIsUploading(true);
        setIsUploadComplete(false);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            const rawBase64 = await fileToRawBase64(file);
            const result = await uploadFunction(rawBase64, file.type);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setIsUploadComplete(true);
            onUploadSuccess(result);
        } catch (err) {
            setUploadProgress(0);
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
            setError(errorMessage);
            onUploadError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            data-testid="file-upload"
        >
            <Card className="p-6">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        isDragging ? 'border-primary bg-primary/10' : 'border-border'
                    } ${!isUploading ? 'cursor-pointer hover:border-primary/50' : 'cursor-not-allowed opacity-60'}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!isUploading) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={!isUploading ? handleDrop : undefined}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    data-testid="drop-zone"
                >
                    {icon}
                    <h3 className="mt-4 font-display text-lg font-semibold">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {description}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={handleFileSelect}
                        data-testid="file-input"
                        disabled={isUploading}
                    />
                </div>

                {uploadProgress > 0 && !error && (
                    <div className="mt-4" data-testid="upload-progress">
                        <Progress value={uploadProgress} />
                        <p className="mt-2 text-sm text-center text-muted-foreground">
                            {uploadProgress < 100
                                ? `Uploading... ${uploadProgress}%`
                                : isUploadComplete
                                    ? 'Upload complete!'
                                    : 'Processing file...'}
                        </p>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </Card>
        </motion.div>
    );
};

export const fileToRawBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (!reader.result) {
                reject(new Error('Failed to read file'));
                return;
            }

            // Convert data URL to raw base64
            const base64WithPrefix = reader.result as string;
            const rawBase64 = base64WithPrefix.split(',')[1];
            resolve(rawBase64);
        };

        reader.readAsDataURL(file);
    });
};