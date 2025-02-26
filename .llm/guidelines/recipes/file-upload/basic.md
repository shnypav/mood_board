# Base reusable file upload component with drag-and-drop support, progress indication, and error handling. Provides core functionality for all file upload variants. :Base file upload component:

## File data MUST always be in raw base64-encoded data (without any MIME prefix). The MIME type must be provided separately.

## Use BaseFileUpload like this:
```tsx
<BaseFileUpload
  onUploadSuccess={onUploadSuccess}
  onUploadError={onUploadError}
  uploadFunction={uploadFunction}
  validation={{
      maxSize: 50,
      allowedTypes: ['application/pdf'],
  }}
  title="Upload File"
  description="Drop your file here"
  icon={<FileUp className="mx-auto h-12 w-12 text-muted-foreground" />}
  accept=".pdf"
/>
```
