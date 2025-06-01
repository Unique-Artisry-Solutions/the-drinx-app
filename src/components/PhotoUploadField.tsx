
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload as _Upload, X, Image } from 'lucide-react';

interface PhotoUploadFieldProps {
  onPhotoSelect: (file: File) => void;
  currentPhoto?: string;
  onPhotoRemove?: () => void;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  onPhotoSelect,
  currentPhoto,
  onPhotoRemove,
  className = '',
  accept = 'image/*',
  maxSize = 5
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onPhotoSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentPhoto ? (
        <div className="relative">
          <img
            src={currentPhoto}
            alt="Selected"
            className="w-full h-48 object-cover rounded-lg border"
          />
          {onPhotoRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onPhotoRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'}
            hover:border-primary/50 cursor-pointer
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-400 mb-4">
            PNG, JPG, GIF up to {maxSize}MB
          </p>
          
          <Input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <Button type="button" variant="outline" asChild>
              <span>Select Photo</span>
            </Button>
          </label>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default PhotoUploadField;
