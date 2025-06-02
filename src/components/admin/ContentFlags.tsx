
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const ContentFlags: React.FC = () => {
  const handleRefresh = () => {
    console.log('Refresh content flags');
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Content Moderation</h1>
          <p className="text-muted-foreground">Review and moderate flagged content</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content moderation features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentFlags;
