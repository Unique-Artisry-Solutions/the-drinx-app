
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FlaggedContentQueueItem } from '@/types/DatabaseTypes';

interface FlagReviewModalProps {
  flag: FlaggedContentQueueItem | null;
  onClose: () => void;
  onDismiss: (flag: FlaggedContentQueueItem) => Promise<void>;
  onTakeAction: (flag: FlaggedContentQueueItem, action: string, reason: string) => Promise<void>;
}

const FlagReviewModal: React.FC<FlagReviewModalProps> = ({
  flag,
  onClose,
  onDismiss,
  onTakeAction
}) => {
  const [actionReason, setActionReason] = useState<string>('');
  
  if (!flag) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const renderContentPreview = () => {
    if (flag.content_type === 'photo') {
      return (
        <div className="my-4">
          <h3 className="font-medium mb-2">Content Preview:</h3>
          <img 
            src={flag.content_preview} 
            alt="Flagged content" 
            className="max-w-full max-h-64 object-contain bg-gray-100 rounded"
          />
        </div>
      );
    }
    
    return (
      <div className="my-4">
        <h3 className="font-medium mb-2">Content Preview:</h3>
        <div className="p-3 bg-gray-50 rounded border">
          {flag.content_preview || 'No preview available'}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Review Flagged Content</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Content Type:</span>
              <div className="mt-1">{flag.content_type}</div>
            </div>
            <div>
              <span className="font-medium">Date Reported:</span>
              <div className="mt-1">{formatDate(flag.reported_at)}</div>
            </div>
            <div>
              <span className="font-medium">Reported By:</span>
              <div className="mt-1">{flag.reporter_name || 'System'}</div>
            </div>
            <div>
              <span className="font-medium">Reason:</span>
              <div className="mt-1">{flag.reason}</div>
            </div>
          </div>

          {flag.details && (
            <div>
              <span className="font-medium">Details:</span>
              <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                {flag.details}
              </div>
            </div>
          )}
          
          {renderContentPreview()}
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Action reason:
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Provide a reason for your moderation action (optional)"
            />
          </div>
        </div>
        
        <div className="flex gap-2 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => onDismiss(flag)}
          >
            Dismiss Flag
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={() => onTakeAction(flag, 'reject', actionReason || 'Content policy violation')}
          >
            Reject Content
          </Button>
          
          <Button 
            variant="default" 
            onClick={() => onTakeAction(flag, 'approve', actionReason)}
          >
            Approve Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlagReviewModal;
