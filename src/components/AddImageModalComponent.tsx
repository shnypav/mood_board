import React, { useState } from 'react';
import { useImages } from '../contexts/ImageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/components/ui/dialog';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { useToast } from "@/shadcn/components/ui/use-toast";

interface AddImageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({ isOpen, onClose }) => {
    const [imageUrl, setImageUrl] = useState('');
    const { addImage } = useImages();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Image</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="url"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Image
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
