
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Archive, RefreshCw } from 'lucide-react';

interface ThreadHeaderProps {
  venueName: string;
  subject?: string;
  onArchive: () => Promise<void>;
  onRefresh: () => void;
  loading?: boolean;
}

const ThreadHeader: React.FC<ThreadHeaderProps> = ({ 
  venueName, 
  subject, 
  onArchive, 
  onRefresh,
  loading
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle>
        {`Conversation with ${venueName || 'Venue'}`}
        {subject && <span className="block text-sm font-normal text-gray-500 mt-1">Re: {subject}</span>}
      </CardTitle>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
        <Button variant="outline" size="sm" onClick={onArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
      </div>
    </div>
  );
};

export default ThreadHeader;
