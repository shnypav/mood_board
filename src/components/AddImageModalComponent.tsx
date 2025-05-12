import React, {useState, useRef, useCallback} from 'react';
import {useImages} from '../contexts/ImageContext';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/shadcn/components/ui/dialog';
import {Button} from '@/shadcn/components/ui/button';
import {Input} from '@/shadcn/components/ui/input';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shadcn/components/ui/tabs";
import {Upload, Link, Loader2} from 'lucide-react';

interface AddImageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({isOpen, onClose}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const {addImage} = useImages();
    const {toast} = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter an image URL"
            });
            return;
        }

        try {
            addImage(imageUrl.trim());
            setImageUrl('');
            onClose();
            toast({
                title: "Success",
                description: "Image added successfully"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add image"
            });
        }
    };

    const processFile = useCallback((file: File) => {
        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select an image file"
            });
            return;
        }

        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "File size exceeds 10MB limit"
            });
            return;
        }

        setIsUploading(true);

        // Create a FileReader to read the file as a data URL
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dataUrl = event.target?.result as string;
                addImage(dataUrl);
                onClose();
                toast({
                    title: "Success",
                    description: "Image uploaded successfully"
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to upload image"
                });
            } finally {
                setIsUploading(false);
                // Reset the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        reader.onerror = () => {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to read the image file"
            });
            setIsUploading(false);
        };

        // Read the file as a data URL (base64 encoded string)
        reader.readAsDataURL(file);
    }, [addImage, onClose, toast]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Image</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload size={16}/> Upload
                        </TabsTrigger>
                        <TabsTrigger value="url" className="flex items-center gap-2">
                            <Link size={16}/> URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 py-4">
                        <div
                            ref={dropZoneRef}
                            className={`border-2 ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'}
                                       rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors`}
                            onClick={handleBrowseClick}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                                    <p className="mt-4 text-sm text-gray-600">Uploading image...</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                        <label
                                            className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rainbow-button"
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4 py-4">
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <Input
                                type="url"
                                placeholder="Enter image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="rainbow-button"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="rainbow-button">
                                    Add Image
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
