
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, AlertTriangle } from 'lucide-react';
import { FlaggedContentQueueItem } from '@/types/DatabaseTypes';

interface FlaggedContentListProps {
  flags?: FlaggedContentQueueItem[];
  isLoading: boolean;
  loadingStates: {[key: string]: boolean};
  onDismiss: (flag: FlaggedContentQueueItem) => Promise<void>;
  onSelectFlag: (flag: FlaggedContentQueueItem) => void;
}

const FlaggedContentList: React.FC<FlaggedContentListProps> = ({
  flags,
  isLoading,
  loadingStates,
  onDismiss,
  onSelectFlag
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Loading flagged content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!flags || flags.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground">No flagged content available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((flag) => (
              <TableRow key={flag.flag_id}>
                <TableCell className="font-mono text-xs">
                  {formatDate(flag.reported_at)}
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-xs font-medium">{flag.content_type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {flag.reason}
                </TableCell>
                <TableCell>
                  {flag.reporter_name || 'System'}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {flag.content_preview || '—'}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectFlag(flag)}
                  >
                    Review
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDismiss(flag)}
                    disabled={loadingStates[flag.flag_id]}
                  >
                    {loadingStates[flag.flag_id] ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Dismiss'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FlaggedContentList;
