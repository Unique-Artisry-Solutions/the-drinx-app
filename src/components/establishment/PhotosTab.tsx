
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Trash } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  description: string;
}

interface PhotosTabProps {
  photos: Photo[];
  handleUploadPhoto: () => void;
  handleDeletePhoto: (id: string) => void;
}

const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  handleUploadPhoto,
  handleDeletePhoto
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mocktail Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUploadPhoto} className="w-full mb-6">
          <Upload className="mr-2 h-4 w-4" /> Upload Photo
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="border rounded-md overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={photo.url} 
                  alt={photo.description} 
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <p className="p-2 text-sm">{photo.description}</p>
            </div>
          ))}
          
          <div 
            className="border border-dashed rounded-md flex items-center justify-center min-h-[150px] cursor-pointer"
            onClick={handleUploadPhoto}
          >
            <div className="text-center p-4">
              <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Add more photos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotosTab;
