import React, {useState, useRef, useEffect} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/shadcn/components/ui/dialog';
import {Button} from '@/shadcn/components/ui/button';
import {Input} from '@/shadcn/components/ui/input';
import {useToast} from "@/shadcn/components/ui/use-toast";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shadcn/components/ui/tabs";
import {Upload, Link, Loader2, X, Image as ImageIcon} from 'lucide-react';

interface AddImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    addImage: (imageUrl: string) => void; // 🔧 Added missing addImage prop
}

export const AddImageModal: React.FC<AddImageModalProps> = ({isOpen, onClose, addImage}) => {
    // State management
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('upload');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Context and hooks
    const {toast} = useToast();

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadButtonRef = useRef<HTMLButtonElement>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    const resetState = () => {
        setImageUrl('');
        setIsUploading(false);
        setIsDragging(false);
        setActiveTab('upload');
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // URL submission handler
    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageUrl.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter an image URL"
            });
            return;
        }

        setIsUploading(true);

        try {
            // Validate URL format
            const url = new URL(imageUrl.trim());

            // Check if it's a valid image URL by trying to load it
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = url.toString();
            });

            addImage(imageUrl.trim());
            toast({
                title: "Success",
                description: "Image added successfully from URL"
            });
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid image URL or failed to load image"
            });
        } finally {
            setIsUploading(false);
        }
    };

    // File validation
    const validateFile = (file: File): boolean => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select an image file (PNG, JPG, GIF, WebP)"
            });
            return false;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "File size exceeds 10MB limit"
            });
            return false;
        }

        return true;
    };

    // File selection handler
    const handleFileSelect = (file: File) => {
        if (!validateFile(file)) {
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    // File input change handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // File input click handler - FIXED for browser security
    const handleFileInputClick = () => {
        console.log('🔍 Attempting to open file picker...');

        if (fileInputRef.current) {
            try {
                // Remove any existing event listeners that might interfere
                const input = fileInputRef.current;

                // Ensure the input is properly focused and visible to the browser
                input.style.display = 'block';
                input.style.position = 'absolute';
                input.style.left = '-9999px';
                input.style.opacity = '0';
                input.style.pointerEvents = 'none';

                // Focus first, then click - this helps with browser security
                input.focus();
                input.click();

                // Hide it again after click
                setTimeout(() => {
                    input.style.display = 'none';
                }, 100);

                console.log('✅ File picker click triggered');
            } catch (error) {
                console.error('❌ Failed to trigger file picker:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Unable to open file picker. Please try again or use drag & drop."
                });
            }
        } else {
            console.error('❌ File input ref not found');
        }
    };

    // Upload selected file
    const handleUploadSelectedFile = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            // Convert file to data URL
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        resolve(event.target.result as string);
                    } else {
                        reject(new Error('Failed to read file'));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(selectedFile);
            });

            addImage(dataUrl);
            toast({
                title: "Success",
                description: `Image "${selectedFile.name}" uploaded successfully`
            });
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to process the image file"
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Cancel preview and reset file selection
    const handleCancelPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
        // Only set dragging to false if we're leaving the drop zone entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));

        if (imageFile) {
            handleFileSelect(imageFile);
        } else if (files.length > 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please drop an image file"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Add New Image
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload size={16}/> Upload
                        </TabsTrigger>
                        <TabsTrigger value="url" className="flex items-center gap-2">
                            <Link size={16}/> URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 py-4">
                        {previewUrl ? (
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium">Image Preview</h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleCancelPreview}
                                            aria-label="Cancel preview"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 truncate">
                                        {selectedFile?.name} ({selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB)
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelPreview}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleUploadSelectedFile}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Image'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div
                                    className={`
                                        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                                        ${isDragging
                                        ? 'border-primary bg-primary/10 scale-105'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }
                                        ${isUploading ? 'pointer-events-none opacity-50' : ''}
                                    `}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    data-testid="dropzone"
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center space-y-4">
                                            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                                            <p className="text-sm text-gray-600">Processing image...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-4">
                                            <Upload
                                                className={`h-12 w-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`}/>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Drag and drop your image here
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF, WebP up to 10MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <span className="text-sm text-gray-500">or</span>
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleFileInputClick();
                                        }}
                                        disabled={isUploading}
                                        className="flex items-center gap-2"
                                        ref={uploadButtonRef}
                                        aria-label="Upload a file from your device"
                                        data-testid="upload-button"
                                    >
                                        <Upload className="h-4 w-4"/>
                                        Upload a file
                                    </Button>
                                </div>

                                {/* Hidden file input - FIXED positioning */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{
                                        display: 'none',
                                        position: 'absolute',
                                        left: '-9999px',
                                        opacity: 0,
                                        pointerEvents: 'none'
                                    }}
                                    disabled={isUploading}
                                    data-testid="file-input"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4 py-4">
                        <form onSubmit={handleUrlSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="image-url" className="text-sm font-medium">
                                    Image URL
                                </label>
                                <Input
                                    id="image-url"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    disabled={isUploading}
                                    data-testid="url-input"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="submit"
                                    disabled={!imageUrl.trim() || isUploading}
                                    data-testid="add-url-button"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Image'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};