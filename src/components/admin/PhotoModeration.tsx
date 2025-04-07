
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Check, X, ImageOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ModerationPhoto } from '@/utils/photoModerationUtils';

const PhotoModeration: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedPhoto, setSelectedPhoto] = useState<ModerationPhoto | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  // Fetch photos based on status
  const { data: photos, isLoading: loadingPhotos, refetch } = useQuery({
    queryKey: ['moderation-photos', activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as unknown as ModerationPhoto[];
    }
  });

  // Handle photo approval
  const handleApprove = async (photo: ModerationPhoto) => {
    setIsLoading(prev => ({ ...prev, [photo.id]: true }));
    
    try {
      const { error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .update({ 
          status: 'approved',
          moderated_at: new Date().toISOString(),
          moderated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      toast({
        title: "Photo approved",
        description: "The photo has been approved and will now be visible to users.",
      });
      
      refetch();
    } catch (error) {
      console.error('Error approving photo:', error);
      toast({
        title: "Approval failed",
        description: "There was a problem approving this photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  // Handle photo rejection
  const handleReject = async (photo: ModerationPhoto) => {
    setIsLoading(prev => ({ ...prev, [photo.id]: true }));
    
    try {
      const { error } = await supabase
        .from('moderation_photos' as any) // Using 'any' to bypass type checking
        .update({ 
          status: 'rejected',
          moderated_at: new Date().toISOString(),
          moderated_by: (await supabase.auth.getUser()).data.user?.id,
          rejection_reason: rejectionReason || 'Content policy violation'
        })
        .eq('id', photo.id);
      
      if (error) throw error;
      
      toast({
        title: "Photo rejected",
        description: "The photo has been rejected and will not be visible to users.",
      });
      
      setRejectionReason('');
      setSelectedPhoto(null);
      refetch();
    } catch (error) {
      console.error('Error rejecting photo:', error);
      toast({
        title: "Rejection failed",
        description: "There was a problem rejecting this photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [photo.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
            {loadingPhotos ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p>Loading photos...</p>
              </div>
            ) : photos && photos.length > 0 ? (
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
                              onClick={() => handleApprove(photo)}
                              disabled={isLoading[photo.id]}
                              className="flex-1 bg-green-500 hover:bg-green-600"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => setSelectedPhoto(photo)}
                              variant="destructive"
                              disabled={isLoading[photo.id]}
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
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        )}
                        {status === 'rejected' && (
                          <Button 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => setSelectedPhoto(photo)}
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
            ) : (
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
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Rejection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedPhoto.status === 'rejected' 
                ? 'Rejection Details' 
                : selectedPhoto.status === 'approved' 
                  ? 'Photo Details' 
                  : 'Reject Photo'}
            </h2>
            
            <div className="mb-4">
              <img 
                src={selectedPhoto.url} 
                alt="User submitted content" 
                className="w-full h-auto max-h-64 object-contain mb-4 bg-gray-100 rounded"
              />
              
              {selectedPhoto.status === 'pending' ? (
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Reason for rejection:
                  </label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this photo."
                  />
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div><strong>ID:</strong> {selectedPhoto.id}</div>
                  <div><strong>Submitted:</strong> {formatDate(selectedPhoto.created_at)}</div>
                  {selectedPhoto.moderated_at && (
                    <div><strong>Moderated:</strong> {formatDate(selectedPhoto.moderated_at)}</div>
                  )}
                  {selectedPhoto.status === 'rejected' && selectedPhoto.rejection_reason && (
                    <div>
                      <strong>Rejection reason:</strong>
                      <p className="mt-1 p-2 bg-gray-50 rounded">
                        {selectedPhoto.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPhoto(null);
                  setRejectionReason('');
                }}
              >
                Close
              </Button>
              
              {selectedPhoto.status === 'pending' && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleReject(selectedPhoto)}
                >
                  Confirm Rejection
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoModeration;
