import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import PromoterThreadListSidebar from './PromoterThreadListSidebar';
import ThreadDetailPanel from '../../establishment/communication/ThreadDetailPanel';
import { MessageSquare } from 'lucide-react';

const PromoterMessagingSplitView: React.FC = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
  };

  if (isMobile) {
    return (
      <div className="h-full">
        {!selectedThreadId ? (
          <PromoterThreadListSidebar 
            onSelectThread={handleSelectThread}
            selectedThreadId={selectedThreadId}
          />
        ) : (
          <ThreadDetailPanel 
            threadId={selectedThreadId}
            onBack={handleBackToList}
            isMobile={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar - Thread List */}
      <div className="w-1/3 border-r border-border">
        <PromoterThreadListSidebar 
          onSelectThread={handleSelectThread}
          selectedThreadId={selectedThreadId}
        />
      </div>
      
      {/* Main Content - Thread Detail */}
      <div className="flex-1">
        {selectedThreadId ? (
          <ThreadDetailPanel 
            threadId={selectedThreadId}
            isMobile={false}
          />
        ) : (
          <Card className="h-full flex items-center justify-center border-0 shadow-none">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-sm">
                Choose a conversation from the list to start messaging with venues
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PromoterMessagingSplitView;