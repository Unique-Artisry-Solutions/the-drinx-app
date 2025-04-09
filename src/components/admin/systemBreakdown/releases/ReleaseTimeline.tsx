
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Release, ReleaseStatus } from '../types/releaseTypes';
import { Calendar, Check, Clock, Package } from 'lucide-react';

interface ReleaseTimelineProps {
  releases: Release[];
  onSelectRelease: (id: string) => void;
}

const ReleaseTimeline: React.FC<ReleaseTimelineProps> = ({ 
  releases,
  onSelectRelease
}) => {
  // Sort releases by planned or actual release date
  const sortedReleases = [...releases].sort((a, b) => {
    const aDate = a.actualReleaseDate || a.plannedReleaseDate || '';
    const bDate = b.actualReleaseDate || b.plannedReleaseDate || '';
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });
  
  // Group releases by year and quarter
  const releasesByYearQuarter: Record<string, Release[]> = {};
  
  sortedReleases.forEach(release => {
    const date = new Date(release.actualReleaseDate || release.plannedReleaseDate || '');
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `${year}-Q${quarter}`;
      
      if (!releasesByYearQuarter[key]) {
        releasesByYearQuarter[key] = [];
      }
      releasesByYearQuarter[key].push(release);
    }
  });
  
  // Convert to array for rendering
  const timelineGroups = Object.entries(releasesByYearQuarter)
    .sort(([a], [b]) => b.localeCompare(a)) // Sort in reverse chronological order
    .map(([yearQuarter, releases]) => ({
      yearQuarter,
      releases
    }));
    
  const renderStatusIcon = (status: ReleaseStatus) => {
    switch (status) {
      case 'released':
        return <Check className="h-5 w-5 text-white" />;
      case 'in_development':
      case 'ready_for_qa':
      case 'in_qa':
      case 'ready_for_release':
        return <Clock className="h-5 w-5 text-white" />;
      default:
        return <Calendar className="h-5 w-5 text-white" />;
    }
  };
  
  const getStatusColor = (status: ReleaseStatus) => {
    switch (status) {
      case 'released':
        return 'bg-green-500';
      case 'ready_for_release':
        return 'bg-emerald-500';
      case 'in_qa':
        return 'bg-amber-500';
      case 'ready_for_qa':
        return 'bg-purple-500';
      case 'in_development':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Released</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-sm">Ready for Release</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm">In QA</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">Ready for QA</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">In Development</span>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-gray-500 mr-2"></div>
              <span className="text-sm">Planned</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
          
          <div className="space-y-12">
            {timelineGroups.map(({ yearQuarter, releases }) => (
              <div key={yearQuarter} className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="px-4 py-1 rounded-full bg-gray-100 text-gray-800 font-medium z-10">
                    {yearQuarter.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="space-y-8">
                  {releases.map((release, index) => {
                    const isEven = index % 2 === 0;
                    const date = new Date(release.actualReleaseDate || release.plannedReleaseDate || '');
                    const formattedDate = date.toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    
                    return (
                      <div key={release.id} className="relative">
                        {/* Timeline point */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -mt-2">
                          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${getStatusColor(release.status)}`}>
                            {renderStatusIcon(release.status)}
                          </div>
                        </div>
                        
                        {/* Content box */}
                        <div 
                          className={`w-5/12 bg-white p-4 rounded-md shadow border hover:border-blue-300 cursor-pointer transition-colors ${
                            isEven ? 'mr-auto' : 'ml-auto'
                          }`}
                          onClick={() => onSelectRelease(release.id)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="font-mono font-medium">v{release.version}</span>
                            </div>
                            <div className="text-sm text-gray-500">{formattedDate}</div>
                          </div>
                          
                          <h3 className="text-lg font-medium mb-1">{release.name}</h3>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {release.status === 'released' ? (
                              <Badge className="bg-green-500">Released</Badge>
                            ) : (
                              <Badge variant="outline" className={
                                release.status === 'ready_for_release' ? 'border-emerald-500 text-emerald-500' :
                                release.status === 'in_qa' ? 'border-amber-500 text-amber-500' :
                                release.status === 'ready_for_qa' ? 'border-purple-500 text-purple-500' :
                                release.status === 'in_development' ? 'border-blue-500 text-blue-500' :
                                'border-gray-500 text-gray-500'
                              }>
                                {release.status.replace(/_/g, ' ')}
                              </Badge>
                            )}
                            
                            {release.features.length > 0 && (
                              <Badge variant="secondary">{release.features.length} feature{release.features.length !== 1 ? 's' : ''}</Badge>
                            )}
                          </div>
                          
                          {release.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{release.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {releases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Releases Available</h3>
            <p className="text-gray-500">There are no releases to display on the timeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReleaseTimeline;
