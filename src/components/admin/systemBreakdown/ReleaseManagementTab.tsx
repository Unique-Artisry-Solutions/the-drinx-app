
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, Calendar, GitBranch } from 'lucide-react';

import ReleasesList from './releases/ReleasesList';
import ReleaseEditor from './releases/ReleaseEditor';
import ReleaseTimeline from './releases/ReleaseTimeline';
import { useReleaseManagement } from './hooks/useReleaseManagement';

const ReleaseManagementTab: React.FC = () => {
  const releaseManagement = useReleaseManagement();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-500" />
          Release Management
        </CardTitle>
        <CardDescription>
          Plan, track, and publish software releases with detailed version control and release notes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="releases" className="space-y-4">
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
              }}
              onDeleteRelease={releaseManagement.deleteRelease}
            />
          </TabsContent>
          
          <TabsContent value="editor" className="mt-0 border-none p-0">
            {releaseManagement.selectedRelease ? (
              <ReleaseEditor
                release={releaseManagement.selectedRelease}
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
            <ReleaseTimeline releases={releaseManagement.sortedAndFilteredReleases} onSelectRelease={releaseManagement.setSelectedReleaseId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReleaseManagementTab;
