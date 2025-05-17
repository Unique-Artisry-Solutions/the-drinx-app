
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpDown, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Filter, 
  Plus, 
  Tag 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { 
  Release, 
  ReleaseProgress, 
  ReleaseSortField, 
  ReleaseSortOrder, 
  ReleaseFeature 
} from './types/releaseTypes';
import { calculateReleaseCompletion } from './utils/releaseUtils';
import ReleasesList from './releases/ReleasesList';
import ReleaseEditor from './releases/ReleaseEditor';
import ReleaseTimeline from './releases/ReleaseTimeline';
import { v4 as uuidv4 } from 'uuid';
import { useReleaseManagement } from './hooks/useReleaseManagement';

interface ReleaseItemProps {
  release: Release;
  onSelect: (release: Release) => void;
  isSelected: boolean;
}

const ReleaseManagementTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [sortField, setSortField] = useState<ReleaseSortField>('plannedReleaseDate');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const { 
    releases, 
    addNewRelease, 
    updateRelease, 
    deleteRelease,
    releaseProgress 
  } = useReleaseManagement();
  
  const handleSelectRelease = (release: Release) => {
    setSelectedRelease(release);
    setActiveTab('edit');
  };
  
  const handleCreateNewRelease = () => {
    const newReleaseTemplate = {
      id: uuidv4(),
      version: '',
      name: '',
      type: 'minor',
      status: 'planned',
      description: '',
      features: [],
      releaseNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      team: [],
      tags: [],
      releaseBranch: 'develop'
    } as Release;
    
    setSelectedRelease(newReleaseTemplate);
    setActiveTab('edit');
  };
  
  const handleSaveRelease = (updatedRelease: Release) => {
    if (releases.some(r => r.id === updatedRelease.id)) {
      updateRelease(updatedRelease);
    } else {
      addNewRelease(updatedRelease);
    }
    setActiveTab('list');
    setSelectedRelease(null);
  };
  
  const handleDeleteRelease = (releaseId: string) => {
    deleteRelease(releaseId);
    setActiveTab('list');
    setSelectedRelease(null);
  };
  
  // Create a properly formatted release progress array for display
  const formattedReleaseProgress: ReleaseProgress[] = releases.map(release => {
    const totalFeatures = release.features.length;
    const completedFeatures = release.features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = release.features.filter(f => f.status === 'in_progress').length;
    const pendingFeatures = release.features.filter(f => f.status === 'pending').length;
    const deferredFeatures = release.features.filter(f => f.status === 'deferred').length;
    const percentComplete = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;
    
    return {
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      pendingFeatures,
      deferredFeatures,
      percentComplete,
      id: release.id,
      version: release.version
    };
  });
  
  const handleAddFeature = (feature: Omit<ReleaseFeature, "id">) => {
    if (!selectedRelease) return;
    
    const newFeature: ReleaseFeature = {
      ...feature,
      id: `feature-${uuidv4()}`
    };
    
    const updatedRelease = {
      ...selectedRelease,
      features: [...selectedRelease.features, newFeature],
      updatedAt: new Date().toISOString()
    };
    
    setSelectedRelease(updatedRelease);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Release Management</CardTitle>
        <CardDescription>
          Plan, track, and manage software releases and features
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="list">Releases</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger 
              value="edit"
              disabled={!selectedRelease && activeTab !== "edit"}
            >
              {selectedRelease ? 'Edit Release' : 'New Release'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_development">In Development</SelectItem>
                    <SelectItem value="ready_for_qa">Ready for QA</SelectItem>
                    <SelectItem value="in_qa">In QA</SelectItem>
                    <SelectItem value="ready_for_release">Ready for Release</SelectItem>
                    <SelectItem value="released">Released</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
              
              <Button onClick={handleCreateNewRelease}>
                <Plus className="h-4 w-4 mr-2" />
                New Release
              </Button>
            </div>
            
            <ReleasesList 
              releases={releases}
              sortField={sortField}
              sortOrder={sortOrder}
              filterStatus={filterStatus}
              onSelectRelease={handleSelectRelease}
              releaseProgress={formattedReleaseProgress}
            />
          </TabsContent>
          
          <TabsContent value="timeline">
            <ReleaseTimeline releases={releases} />
          </TabsContent>
          
          <TabsContent value="edit">
            {selectedRelease && (
              <ReleaseEditor 
                release={selectedRelease} 
                onSave={handleSaveRelease}
                onDelete={handleDeleteRelease}
                onCancel={() => {
                  setActiveTab('list');
                  setSelectedRelease(null);
                }}
                onAddFeature={handleAddFeature}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default ReleaseManagementTab;
