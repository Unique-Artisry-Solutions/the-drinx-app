
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  FileText, 
  Calendar, 
  GitBranch,
  BarChart,
  Settings
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import ReleasesList from './releases/ReleasesList';
import ReleaseEditor from './releases/ReleaseEditor';
import ReleaseTimeline from './releases/ReleaseTimeline';
import { useReleaseManagement } from './hooks/useReleaseManagement';

const ReleaseManagementTab: React.FC = () => {
  const releaseManagement = useReleaseManagement();
  const [activeTab, setActiveTab] = useState('releases');
  
  // Calculate total releases by status
  const releasesByStatus = releaseManagement.releases.reduce((acc, release) => {
    acc[release.status] = (acc[release.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const totalReleases = releaseManagement.releases.length;
  const releasedCount = releasesByStatus['released'] || 0;
  const plannedCount = releasesByStatus['planned'] || 0;
  const inDevelopmentCount = releasesByStatus['in_development'] || 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-500" />
              Release Management
            </CardTitle>
            <CardDescription>
              Plan, track, and publish software releases with detailed version control and release notes
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-500 text-green-500">
                {releasedCount} Released
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                {inDevelopmentCount} In Development
              </Badge>
              <Badge variant="outline" className="border-gray-500 text-gray-500">
                {plannedCount} Planned
              </Badge>
            </div>
            
            <Select value={releaseManagement.dateFormat} onValueChange={releaseManagement.setDateFormat}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yyyy-MM-dd">ISO (yyyy-MM-dd)</SelectItem>
                <SelectItem value="MM/dd/yyyy">US (MM/dd/yyyy)</SelectItem>
                <SelectItem value="dd/MM/yyyy">EU (dd/MM/yyyy)</SelectItem>
                <SelectItem value="MMM d, yyyy">Long (Jan 1, 2025)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="releases" className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>Releases</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-1" disabled={!releaseManagement.selectedRelease}>
              <FileText className="h-4 w-4" />
              <span>Release Editor</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1" disabled>
              <BarChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1" disabled>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="releases" className="mt-0 border-none p-0">
            <ReleasesList 
              releases={releaseManagement.sortedAndFilteredReleases}
              selectedReleaseId={releaseManagement.selectedReleaseId}
              sortField={releaseManagement.sortField}
              sortOrder={releaseManagement.sortOrder}
              filterStatus={releaseManagement.filterStatus}
              onSelectRelease={releaseManagement.setSelectedReleaseId}
              onSortChange={(field) => {
                if (releaseManagement.sortField === field) {
                  releaseManagement.setSortOrder(releaseManagement.sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  releaseManagement.setSortField(field);
                  releaseManagement.setSortOrder('asc');
                }
              }}
              onFilterChange={releaseManagement.setFilterStatus}
              onCreateRelease={(releaseData) => {
                const newId = releaseManagement.createRelease(releaseData);
                releaseManagement.setSelectedReleaseId(newId);
                setActiveTab('editor');
              }}
              onDeleteRelease={releaseManagement.deleteRelease}
              getNextVersionNumber={releaseManagement.getNextVersionNumber}
              formatDate={releaseManagement.formatDate}
            />
          </TabsContent>
          
          <TabsContent value="editor" className="mt-0 border-none p-0">
            {releaseManagement.selectedRelease ? (
              <ReleaseEditor
                release={releaseManagement.selectedRelease}
                releaseProgress={releaseManagement.releaseProgress}
                onUpdateRelease={(data) => releaseManagement.updateRelease(releaseManagement.selectedRelease!.id, data)}
                onUpdateStatus={releaseManagement.updateReleaseStatus}
                onAddFeature={(feature) => releaseManagement.addFeatureToRelease(releaseManagement.selectedRelease!.id, feature)}
                onUpdateFeature={releaseManagement.updateFeatureInRelease}
                onRemoveFeature={(featureId) => releaseManagement.removeFeatureFromRelease(releaseManagement.selectedRelease!.id, featureId)}
                onAddReleaseNote={(note) => releaseManagement.addReleaseNote(releaseManagement.selectedRelease!.id, note)}
                onUpdateReleaseNote={(index, note) => releaseManagement.updateReleaseNote(releaseManagement.selectedRelease!.id, index, note)}
                onRemoveReleaseNote={(index) => releaseManagement.removeReleaseNote(releaseManagement.selectedRelease!.id, index)}
                onGenerateNotes={() => releaseManagement.generateReleaseNotesFromFeatures(releaseManagement.selectedRelease!.id)}
                onExportNotes={() => releaseManagement.exportReleaseNotesAsMarkdown(releaseManagement.selectedRelease!.id)}
                formatDate={releaseManagement.formatDate}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Release Selected</h3>
                <p className="text-gray-500">Select a release from the Releases tab to edit</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0 border-none p-0">
            <ReleaseTimeline 
              releases={releaseManagement.sortedAndFilteredReleases} 
              onSelectRelease={(id) => {
                releaseManagement.setSelectedReleaseId(id);
                setActiveTab('editor');
              }}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0 border-none p-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Release Analytics</h3>
              <p className="text-gray-500">This feature is coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 border-none p-0">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Settings className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Release Management Settings</h3>
              <p className="text-gray-500">This feature is coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReleaseManagementTab;
