
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { AudienceSegmentForm } from '@/components/admin/audience/AudienceSegmentForm';
import { AudienceSegmentList } from '@/components/admin/audience/AudienceSegmentList';

export function AudienceManagementTab() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [segments] = useState([]);
  const [isLoading] = useState(false);

  const handleSubmit = () => {
    setShowCreateForm(false);
  };

  const handleEdit = () => {
    // Handle edit logic
  };

  const handleDelete = () => {
    // Handle delete logic
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audience Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      <Tabs defaultValue="segments" className="w-full">
        <TabsList>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="segments" className="space-y-4">
          {showCreateForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Audience Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <AudienceSegmentForm 
                  onCancel={() => setShowCreateForm(false)}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          ) : (
            <AudienceSegmentList 
              segments={segments}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Audience insights and trends will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics for audience segments will be shown here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
