export interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  addImage: (imageUrl: string) => void;
}

export interface FileUploadState {
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  isDragging: boolean;
}

export interface UrlUploadState {
  imageUrl: string;
  isUploading: boolean;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileUploadCallbacks {
  onFileSelect: (file: File) => void;
  onUpload: () => Promise<void>;
  onCancel: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export interface UrlUploadCallbacks {
  onUrlChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}
