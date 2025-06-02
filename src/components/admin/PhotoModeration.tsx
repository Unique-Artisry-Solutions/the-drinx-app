
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { usePhotoModeration } from './photoModeration/usePhotoModeration';
import PhotoModerationList from './photoModeration/PhotoModerationList';
import PhotoDetailModal from './photoModeration/PhotoDetailModal';

const PhotoModeration: React.FC = () => {
  console.log('PhotoModeration: Component rendered directly');
  
  const {
    activeTab,
    setActiveTab,
    photos,
    loadingPhotos,
    isLoading,
    selectedPhoto,
    setSelectedPhoto,
    rejectionReason,
    setRejectionReason,
    handleApprove,
    handleReject,
    refetch
  } = usePhotoModeration();

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Photo Moderation</h1>
          <p className="text-muted-foreground">Review and moderate user-submitted photos</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loadingPhotos}
        >
          <RefreshCw className={`h-4 w-4 ${loadingPhotos ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <PhotoModerationList
              photos={photos}
              status={status}
              isLoading={loadingPhotos}
              loadingStates={isLoading}
              onApprove={handleApprove}
              onSelectPhoto={setSelectedPhoto}
            />
          </TabsContent>
        ))}
      </Tabs>

      <PhotoDetailModal
        photo={selectedPhoto}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={() => {
          setSelectedPhoto(null);
          setRejectionReason('');
        }}
        onReject={handleReject}
      />
    </div>
  );
};

export default PhotoModeration;
