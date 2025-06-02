
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhotoUploadFieldProps {
  onPhotosUploaded?: (urls: string[]) => void;
  onPhotoSelect?: (file: File) => void;
  maxPhotos?: number;
  label?: string;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  onPhotosUploaded,
  onPhotoSelect,
  maxPhotos = 5,
  label = "Upload Photos"
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      const newPhotoUrls: string[] = [];
      
      for (let i = 0; i < Math.min(files.length, maxPhotos - uploadedPhotos.length); i++) {
        const file = files[i];
        
        // If onPhotoSelect is provided, call it for each file
        if (onPhotoSelect) {
          onPhotoSelect(file);
        }
        
        const mockUrl = URL.createObjectURL(file);
        newPhotoUrls.push(mockUrl);
      }
      
      const updatedPhotos = [...uploadedPhotos, ...newPhotoUrls];
      setUploadedPhotos(updatedPhotos);
      onPhotosUploaded?.(updatedPhotos);
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updatedPhotos);
    onPhotosUploaded?.(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="photo-upload">{label}</Label>
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading || uploadedPhotos.length >= maxPhotos}
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">
          {uploadedPhotos.length}/{maxPhotos} photos uploaded
        </p>
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removePhoto(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-sm text-blue-600">
          Uploading photos...
        </div>
      )}
    </div>
  );
};

export default PhotoUploadField;
