import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Release, ReleaseFeature, ReleaseNote, ReleaseStatus, ReleaseType, ReleaseFeatureStatus, ReleaseProgress } from '../systemBreakdown/types/releaseTypes';

// Lazy load the heavy release editor component
const ReleaseEditor = React.lazy(() => 
  import('@/components/admin/systemBreakdown/releases/ReleaseEditor')
);

interface LazyReleaseEditorProps {
  release: Release;
  releaseProgress: ReleaseProgress | null;
  onUpdateRelease: (data: Partial<Release>) => void;
  onUpdateStatus: (id: string, status: ReleaseStatus) => void;
  onAddFeature: (feature: Omit<ReleaseFeature, 'id'>) => void;
  onUpdateFeature: (releaseId: string, featureId: string, data: Partial<ReleaseFeature>) => void;
  onRemoveFeature: (featureId: string) => void;
  onAddReleaseNote: (note: ReleaseNote) => void;
  onUpdateReleaseNote: (index: number, note: ReleaseNote) => void;
  onRemoveReleaseNote: (index: number) => void;
  onGenerateNotes: () => void;
  onExportNotes: () => void;
  formatDate: (dateString?: string) => string;
}

// Release editor loading fallback with proper skeleton
const ReleaseEditorLoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    
    {/* Tabs skeleton */}
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Tab content area */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          {/* Features list */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between border rounded p-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
          
          {/* Progress section */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between text-sm">
             <Skeleton className="h-4 w-16" />
             <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Main lazy wrapper component
export const LazyReleaseEditor: React.FC<LazyReleaseEditorProps> = (props) => {
  return (
    <Suspense fallback={<ReleaseEditorLoadingFallback />}>
      <ReleaseEditor {...props} />
    </Suspense>
  );
};

export default LazyReleaseEditor;