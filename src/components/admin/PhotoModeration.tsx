
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

const PhotoModeration: React.FC = () => {
  const handleRefresh = () => {
    console.log('Refresh photo moderation');
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Photo Moderation</h1>
          <p className="text-muted-foreground">Review and moderate user-submitted photos</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Photo moderation features will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Approved photos will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Rejected photos will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PhotoModeration;
