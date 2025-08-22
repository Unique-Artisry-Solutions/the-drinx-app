import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import EstablishmentThreadListSidebar from './EstablishmentThreadListSidebar';
import ThreadDetailPanel from './ThreadDetailPanel';
import { MessageSquare } from 'lucide-react';

const MessagingSplitView: React.FC = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
  };

  // Mobile: show either list or detail view
  if (isMobile) {
    if (selectedThreadId) {
      return (
        <ThreadDetailPanel 
          threadId={selectedThreadId} 
          onBack={handleBackToList} 
          isMobile={true}
        />
      );
    }
    
    return (
      <EstablishmentThreadListSidebar 
        onSelectThread={handleSelectThread}
        selectedThreadId={selectedThreadId}
        isMobile={true}
      />
    );
  }

  // Desktop: split view
  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Left Sidebar - Thread List */}
      <div className="w-96 flex-shrink-0">
        <EstablishmentThreadListSidebar 
          onSelectThread={handleSelectThread}
          selectedThreadId={selectedThreadId}
          isMobile={false}
        />
      </div>

      {/* Right Panel - Conversation Detail */}
      <div className="flex-1">
        {selectedThreadId ? (
          <ThreadDetailPanel 
            threadId={selectedThreadId} 
            onBack={handleBackToList}
            isMobile={false}
          />
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center p-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to view the full thread
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessagingSplitView;