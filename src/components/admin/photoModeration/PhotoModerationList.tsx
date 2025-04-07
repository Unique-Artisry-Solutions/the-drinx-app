
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, X } from 'lucide-react';
import { ModerationPhoto } from '@/utils/photoModerationUtils';

interface PhotoModerationListProps {
  photos?: ModerationPhoto[];
  status: string;
  isLoading: boolean;
  loadingStates: {[key: string]: boolean};
  onApprove: (photo: ModerationPhoto) => Promise<void>;
  onSelectPhoto: (photo: ModerationPhoto) => void;
}

const PhotoModerationList: React.FC<PhotoModerationListProps> = ({
  photos,
  status,
  isLoading,
  loadingStates,
  onApprove,
  onSelectPhoto
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Loading photos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground">No {status} photos available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img 
              src={photo.url} 
              alt="User submitted content" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
              <div className="truncate">ID: {photo.id.substring(0, 8)}...</div>
              <div>{formatDate(photo.created_at)}</div>
            </div>
          </div>
          
          <div className="p-3 flex flex-col gap-2">
            {status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  className="flex-1 h-8" 
                  size="sm"
                  onClick={() => onApprove(photo)}
                  disabled={loadingStates[photo.id]}
                >
                  {loadingStates[photo.id] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </>
                  )}
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 h-8" 
                  size="sm"
                  onClick={() => onSelectPhoto(photo)}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            )}
            
            {(status === 'approved' || status === 'rejected') && (
              <Button 
                variant="outline" 
                className="w-full h-8" 
                size="sm"
                onClick={() => onSelectPhoto(photo)}
              >
                View Details
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PhotoModerationList;
