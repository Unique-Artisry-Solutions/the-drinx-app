
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadFieldProps {
  onPhotoSelect: (file: File) => void;
  className?: string;
  requiresModeration?: boolean;
  onModerationRequired?: () => void;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({ 
  onPhotoSelect,
  className = "",
  requiresModeration = false,
  onModerationRequired
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (jpeg, png, etc).',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent component
    onPhotoSelect(file);
    
    // Show appropriate toast message based on moderation requirements
    if (requiresModeration) {
      toast({
        title: "Photo submitted for review",
        description: "Your photo will be visible after approval.",
      });
      
      if (onModerationRequired) {
        onModerationRequired();
      }
    } else {
      toast({
        title: 'Photo uploaded',
        description: 'Your photo has been successfully uploaded.',
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
            onClick={removePhoto}
          >
            <X size={16} />
          </Button>
          {requiresModeration && (
            <div className="absolute bottom-0 left-0 right-0 bg-amber-100 text-amber-800 py-1 px-2 text-xs text-center">
              Pending approval
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-material-primary bg-material-primary/5' : 'border-gray-300'
          }`}
          onClick={triggerFileInput}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center h-32">
            <div className="mb-3 bg-material-primary/10 p-3 rounded-full">
              <Camera className="h-6 w-6 text-material-primary" />
            </div>
            <p className="mb-2 text-sm font-medium">
              <span className="text-material-primary">Upload a photo</span> or drag and drop
            </p>
            <p className="text-xs text-material-on-surface-variant">
              PNG, JPG, GIF up to 5MB
            </p>
            {requiresModeration && (
              <p className="text-xs text-amber-500 mt-1">
                Photos require admin approval before being displayed
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadField;
