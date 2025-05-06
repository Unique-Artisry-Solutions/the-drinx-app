
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { AudienceSegmentList } from './AudienceSegmentList';
import { AudienceSegmentForm } from './AudienceSegmentForm';
import { AudienceSegment } from '@/types/AudienceTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, RefreshCw } from 'lucide-react';

export const AudienceManagementTab = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedSegment, setSelectedSegment] = useState<AudienceSegment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { 
    segments,
    isLoadingSegments,
    refetchSegments,
    createSegment,
    updateSegment,
    deleteSegment
  } = useAudienceSegments();

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (segment.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && segment.is_active) ||
                         (statusFilter === 'inactive' && !segment.is_active);
    return matchesSearch && matchesStatus;
  });
  
  const handleCreateSegment = async (segmentData: any) => {
    await createSegment.mutateAsync(segmentData);
    setActiveView('list');
  };
  
  const handleUpdateSegment = async (segmentId: string, updates: Partial<AudienceSegment>) => {
    await updateSegment.mutateAsync({ id: segmentId, updates });
    setActiveView('list');
    setSelectedSegment(null);
  };
  
  const handleDeleteSegment = async (segmentId: string) => {
    await deleteSegment.mutateAsync(segmentId);
  };
  
  const handleEditSegment = (segment: AudienceSegment) => {
    setSelectedSegment(segment);
    setActiveView('edit');
  };
  
  const handleRefresh = () => {
    refetchSegments();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audience Segmentation</CardTitle>
              <CardDescription>
                Create and manage audience segments for targeted marketing
              </CardDescription>
            </div>
            {activeView === 'list' ? (
              <Button onClick={() => setActiveView('create')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Segment
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setActiveView('list');
                setSelectedSegment(null);
              }}>
                Back to Segments
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeView === 'list' && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search segments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Tabs defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <AudienceSegmentList 
                segments={filteredSegments} 
                isLoading={isLoadingSegments}
                onEdit={handleEditSegment}
                onDelete={handleDeleteSegment}
              />
            </>
          )}
          
          {activeView === 'create' && (
            <AudienceSegmentForm
              onSubmit={handleCreateSegment}
              onCancel={() => setActiveView('list')}
            />
          )}
          
          {activeView === 'edit' && selectedSegment && (
            <AudienceSegmentForm
              segment={selectedSegment}
              onSubmit={(data) => handleUpdateSegment(selectedSegment.id, data.segment)}
              onCancel={() => {
                setActiveView('list');
                setSelectedSegment(null);
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
