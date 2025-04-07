
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, EyeOff, ImageOff } from 'lucide-react';
import { ModerationPhoto } from '@/utils/photoModerationUtils';

interface PhotoModerationListProps {
  photos: ModerationPhoto[] | null;
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
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <PhotoModerationEmptyState loading={true} />;
  }

  if (!photos || photos.length === 0) {
    return <PhotoModerationEmptyState status={status} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden">
          <div className="relative aspect-square bg-gray-100">
            <img 
              src={photo.url} 
              alt="User submitted content" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
                e.currentTarget.classList.add('p-4');
              }}
            />
          </div>
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2">
              Submitted: {formatDate(photo.created_at)}
            </div>
            <div className="flex gap-2">
              {status === 'pending' && (
                <>
                  <Button 
                    onClick={() => onApprove(photo)}
                    disabled={loadingStates[photo.id]}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => onSelectPhoto(photo)}
                    variant="destructive"
                    disabled={loadingStates[photo.id]}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {status === 'approved' && (
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => onSelectPhoto(photo)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}
              {status === 'rejected' && (
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => onSelectPhoto(photo)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  View Reason
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const PhotoModerationEmptyState: React.FC<{ status?: string; loading?: boolean }> = ({ 
  status = 'pending', 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <p>Loading photos...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 border rounded-md bg-gray-50">
      <ImageOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
      <h3 className="text-lg font-medium mb-1">No photos to moderate</h3>
      <p className="text-muted-foreground">
        {status === 'pending' 
          ? 'There are no pending photos to review.' 
          : status === 'approved' 
            ? 'No photos have been approved yet.'
            : 'No photos have been rejected yet.'}
      </p>
    </div>
  );
};

export default PhotoModerationList;
