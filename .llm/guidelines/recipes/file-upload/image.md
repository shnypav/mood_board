# Specialized component for image file uploads. Supports multiple image formats and provides image dimension information. :Image upload component:

## File data MUST always be in raw base64-encoded data (without any MIME prefix). The MIME type must be provided separately.

## Use ImageFileUpload like this:
```tsx
<ImageFileUpload
    onUploadSuccess={handleUploadSuccess}
    onUploadError={handleUploadError}
    uploadFunction={(base64WithMimeType, type) => api.uploadNewFile({ content: base64WithMimeType, mimeType: type  })}
/>
```

## To preview uploaded images on the page, use this code:
```typescript
  const fetchFiles = async () => {
  try {
    const fetchedFiles = await api.getAllFiles();

    // Fetch previews for image files
    const filesWithPreview = await Promise.all(fetchedFiles.map(async file => {
      let previewUrl;
      if (file.type.startsWith('image/')) {
        try {
          const fileData = await api.getFileByID(file.id);
          previewUrl = fileData.content;
        } catch (error) {
          log('Error fetching preview for file:', file.id, error);
          previewUrl = undefined;
        }
      }

      return {
        ...file,
        fileType: determineFileType(file.type),
        previewUrl
      };
    }));

    setFiles(filesWithPreview);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch files",
      variant: "destructive",
    });
  }
};
```
