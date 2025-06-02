
import React from 'react';
import { useContentFlags } from './contentFlags/useContentFlags';
import FlaggedContentList from './contentFlags/FlaggedContentList';
import FlagReviewModal from './contentFlags/FlagReviewModal';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ContentFlags: React.FC = () => {
  const {
    flags,
    loadingFlags,
    selectedFlag,
    setSelectedFlag,
    isLoading,
    handleDismiss,
    handleTakeAction,
    refetch
  } = useContentFlags();

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Content Moderation</h1>
          <p className="text-muted-foreground">Review and moderate flagged content</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loadingFlags}
        >
          <RefreshCw className={`h-4 w-4 ${loadingFlags ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <FlaggedContentList
        flags={flags}
        isLoading={loadingFlags}
        loadingStates={isLoading}
        onDismiss={handleDismiss}
        onSelectFlag={setSelectedFlag}
      />

      <FlagReviewModal
        flag={selectedFlag}
        onClose={() => setSelectedFlag(null)}
        onDismiss={handleDismiss}
        onTakeAction={handleTakeAction}
      />
    </div>
  );
};

export default ContentFlags;
