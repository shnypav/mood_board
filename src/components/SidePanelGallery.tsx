import {useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/shadcn/components/ui/sheet';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    additionalImages?: {
        url: string;
        caption?: string;
    }[];
}

interface GalleryProps {
    /** Array of gallery images to display */
    images: GalleryItem[];
    /** Optional className for the grid container */
    className?: string;
}

export const SidePanelGallery = ({images, className}: GalleryProps) => {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    return (
        <div className="relative h-screen overflow-hidden">
            <ScrollAreaPrimitive.Root className="h-full overflow-hidden">
                <ScrollAreaPrimitive.Viewport className="h-full w-full">
                    {/* Gallery Grid */}
                    <div className={`grid grid-cols-2 md:grid-cols-3 ${className}`}>
                        {images.map((item) => (
                            <div
                                key={item.id}
                                className="relative aspect-square overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedItem(item)}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </ScrollAreaPrimitive.Viewport>
                <ScrollAreaPrimitive.Scrollbar
                    className="flex touch-none select-none transition-colors"
                    orientation="vertical"
                    style={{width: '12px', padding: '2px'}}
                >
                    <ScrollAreaPrimitive.Thumb
                        className="relative flex-1 rounded-full bg-zinc-600/50 select-none transition-all duration-150 ease-out opacity-0 data-[state=visible]:opacity-100"
                        style={{width: '12px'}}
                    />
                </ScrollAreaPrimitive.Scrollbar>
            </ScrollAreaPrimitive.Root>

            {/* Side Panel */}
            <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <SheetContent className="w-full sm:max-w-xl">
                    <ScrollAreaPrimitive.Root className="h-full">
                        <ScrollAreaPrimitive.Viewport className="h-full">
                            <SheetHeader>
                                <SheetTitle className="text-2xl font-bold">{selectedItem?.title}</SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                <div className="prose prose-sm">
                                    <p>{selectedItem?.description}</p>
                                </div>

                                {selectedItem?.additionalImages && selectedItem.additionalImages.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            {selectedItem.additionalImages.map((image, index) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="relative aspect-video overflow-hidden rounded-lg">
                                                        <img
                                                            src={image.url}
                                                            alt={image.caption || `Additional image ${index + 1}`}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    {image.caption && (
                                                        <p className="text-sm text-gray-500">{image.caption}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollAreaPrimitive.Viewport>
                    </ScrollAreaPrimitive.Root>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default SidePanelGallery;