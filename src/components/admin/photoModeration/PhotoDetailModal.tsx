
import React from 'react';
import { Button } from '@/components/ui/button';
import { ModerationPhoto } from '@/utils/photoModerationUtils';

interface PhotoDetailModalProps {
  photo: ModerationPhoto | null;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onReject: (photo: ModerationPhoto) => Promise<void>;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  rejectionReason,
  onReasonChange,
  onClose,
  onReject
}) => {
  if (!photo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {photo.content_status === 'rejected' 
            ? 'Rejection Details' 
            : photo.content_status === 'approved' 
              ? 'Photo Details' 
              : 'Reject Photo'}
        </h2>
        
        <div className="mb-4">
          <img 
            src={photo.url} 
            alt="User submitted content" 
            className="w-full h-auto max-h-64 object-contain mb-4 bg-gray-100 rounded"
          />
          
          {photo.content_status === 'pending' ? (
            <div>
              <label className="block mb-2 text-sm font-medium">
                Reason for rejection:
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={rejectionReason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Please provide a reason for rejecting this photo."
              />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {photo.id}</div>
              <div><strong>Submitted:</strong> {formatDate(photo.created_at)}</div>
              {photo.moderated_at && (
                <div><strong>Moderated:</strong> {formatDate(photo.moderated_at)}</div>
              )}
              {photo.content_status === 'rejected' && photo.rejection_reason && (
                <div>
                  <strong>Rejection reason:</strong>
                  <p className="mt-1 p-2 bg-gray-50 rounded">
                    {photo.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          
          {photo.content_status === 'pending' && (
            <Button 
              variant="destructive" 
              onClick={() => onReject(photo)}
            >
              Confirm Rejection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailModal;
