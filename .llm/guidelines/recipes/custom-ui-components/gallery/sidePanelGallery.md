# A responsive image gallery with a sliding side panel that reveals detailed information and additional images when an item is selected. Use when: You need to showcase a collection of images (6+ images) with additional details like text or images, perfect for photo collections where each item has a story to tell. :side panel gallery component:

## IMPORTANT: Avoid wrapping full-width components (carousels, galleries, horizontal scrolls) in grid layouts - they need to be full-width to work.
BAD example, don't do this:
```typescript
<div className="grid grid-cols-3">
  <SidePanelGallery /> {/* Already has grid layout */}
</div>
```

GOOD example:
```typescript
<SidePanelGallery images={galleryImages} className="gap-4" />
```

## How to use `SidePanelGallery`.
First, create gallery images: 
```tsx
const galleryImages: GalleryItem[] = [
  {
    id: '1',
    title: 'Nature Series',
    description: 'Capturing the beauty of natural landscapes.',
    imageUrl: '/images/nature-main.jpg',
    // Example without additional images
  },
  {
    id: '2',
    title: 'Urban Perspectives',
    description: 'Street photography exploring city life.',
    imageUrl: '/images/urban-main.jpg',
    additionalImages: [
      {
        url: '/images/urban-detail1.jpg',
        caption: 'Night scene'
      }
    ]
  },
...
];
```

Then use `SidePanelGallery` like this:
```typescript
<SidePanelGallery images={galleryImages} />
```
