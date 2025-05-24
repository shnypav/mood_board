import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddImageModal } from './AddImageModalComponent';
import { useImages } from '../contexts/ImageContext';
import { useToast } from "@/shadcn/components/ui/use-toast";

// Mock the context hooks
jest.mock('../contexts/ImageContext', () => ({
  useImages: jest.fn(),
}));

jest.mock('@/shadcn/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('AddImageModal', () => {
  const mockOnClose = jest.fn();
  const mockAddImage = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    (useImages as jest.Mock).mockReturnValue({
      addImage: mockAddImage,
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mocked-object-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders the modal when isOpen is true', () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Add New Image')).toBeInTheDocument();
  });

  it('has a file input that only accepts image files', () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('opens file dialog when "Upload a file" button is clicked', () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Get the file input and mock its click method
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const clickSpy = jest.spyOn(fileInput, 'click');
    
    // Click the upload button
    const uploadButton = screen.getByTestId('upload-button');
    fireEvent.click(uploadButton);
    
    // Verify the file input's click method was called
    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows a preview when a valid image file is selected', async () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Get the file input and simulate file selection
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Check that the preview appears
    await waitFor(() => {
      expect(screen.getByText('Image Preview')).toBeInTheDocument();
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
      expect(screen.getByText(/test\.png/)).toBeInTheDocument();
    });
  });

  it('calls addImage and closes modal when upload is confirmed', async () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Get the file input and simulate file selection
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for preview to appear and click upload
    await waitFor(() => {
      const uploadButton = screen.getByText('Upload Image');
      fireEvent.click(uploadButton);
    });
    
    // Verify addImage was called and modal was closed
    await waitFor(() => {
      expect(mockAddImage).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows error message when non-image file is selected', async () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Create a mock non-image file
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    // Get the file input and simulate file selection
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verify error toast was shown
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        variant: "destructive",
        title: "Error",
      }));
    });
    
    // Verify addImage was not called
    expect(mockAddImage).not.toHaveBeenCalled();
  });

  it('allows adding images via URL', async () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Switch to URL tab
    const urlTab = screen.getByText('URL');
    fireEvent.click(urlTab);
    
    // Enter a URL
    const urlInput = screen.getByTestId('url-input');
    fireEvent.change(urlInput, { target: { value: 'https://example.com/image.jpg' } });
    
    // Mock the Image loading
    const originalImage = global.Image;
    global.Image = class {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = '';
      
      constructor() {
        setTimeout(() => this.onload(), 10);
      }
    } as unknown as typeof Image;
    
    // Submit the form
    const addButton = screen.getByTestId('add-url-button');
    fireEvent.click(addButton);
    
    // Verify addImage was called with the URL
    await waitFor(() => {
      expect(mockAddImage).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(mockOnClose).toHaveBeenCalled();
    });
    
    // Restore the original Image
    global.Image = originalImage;
  });

  it('handles drag and drop of image files', async () => {
    render(<AddImageModal isOpen={true} onClose={mockOnClose} />);
    
    // Create a mock file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Get the dropzone
    const dropzone = screen.getByTestId('dropzone');
    
    // Simulate drag events
    fireEvent.dragEnter(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Verify dropzone is highlighted
    expect(dropzone).toHaveClass('border-primary');
    
    // Simulate drop
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Check that the preview appears
    await waitFor(() => {
      expect(screen.getByText('Image Preview')).toBeInTheDocument();
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });
});