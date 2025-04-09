
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Release, ReleaseStatus } from '../types/releaseTypes';
import { 
  Calendar, 
  Check, 
  Clock, 
  Package, 
  Users, 
  Tag,
  ArrowRight,
  ArrowLeft,
  GitBranch
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format, parseISO, isValid } from 'date-fns';

interface ReleaseTimelineProps {
  releases: Release[];
  onSelectRelease: (id: string) => void;
}

const ReleaseTimeline: React.FC<ReleaseTimelineProps> = ({ 
  releases,
  onSelectRelease
}) => {
  const [timeScale, setTimeScale] = useState<'months' | 'quarters' | 'years'>('months');
  
  // Sort releases by planned or actual release date
  const sortedReleases = [...releases].sort((a, b) => {
    const aDate = a.actualReleaseDate || a.plannedReleaseDate || '';
    const bDate = b.actualReleaseDate || b.plannedReleaseDate || '';
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });
  
  // Group releases by time period
  const releasesByTimePeriod = sortedReleases.reduce<Record<string, Release[]>>((acc, release) => {
    const date = new Date(release.actualReleaseDate || release.plannedReleaseDate || '');
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      let key: string;
      
      switch (timeScale) {
        case 'quarters':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${year}-Q${quarter}`;
          break;
        case 'years':
          key = `${year}`;
          break;
        case 'months':
        default:
          const month = date.getMonth() + 1;
          key = `${year}-${month.toString().padStart(2, '0')}`;
          break;
      }
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(release);
    }
    return acc;
  }, {});
  
  // Convert to array for rendering
  const timelineGroups = Object.entries(releasesByTimePeriod)
    .sort(([a], [b]) => b.localeCompare(a)) // Sort in reverse chronological order
    .map(([timePeriod, releases]) => ({
      timePeriod,
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
  
  const formatTimePeriod = (period: string) => {
    switch (timeScale) {
      case 'quarters':
        return period.replace('-', ' ');
      case 'years':
        return period;
      case 'months':
      default:
        const [year, month] = period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return format(date, 'MMMM yyyy');
    }
  };

  // Calculate feature completion percentage for a release
  const getFeatureCompletionPercentage = (release: Release) => {
    const totalFeatures = release.features.length;
    if (totalFeatures === 0) return 100;
    
    const completedFeatures = release.features.filter(f => f.status === 'completed').length;
    return Math.round((completedFeatures / totalFeatures) * 100);
  };
  
  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM d, yyyy') : '';
    } catch (error) {
      return '';
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
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
          
          <div className="flex space-x-2">
            <Badge 
              variant={timeScale === 'months' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setTimeScale('months')}
            >
              Months
            </Badge>
            <Badge 
              variant={timeScale === 'quarters' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setTimeScale('quarters')}
            >
              Quarters
            </Badge>
            <Badge 
              variant={timeScale === 'years' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setTimeScale('years')}
            >
              Years
            </Badge>
          </div>
        </div>
        
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
          
          <div className="space-y-12">
            {timelineGroups.map(({ timePeriod, releases }) => (
              <div key={timePeriod} className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="px-4 py-1 rounded-full bg-gray-100 text-gray-800 font-medium z-10">
                    {formatTimePeriod(timePeriod)}
                  </div>
                </div>
                
                <div className="space-y-8">
                  {releases.map((release, index) => {
                    const isEven = index % 2 === 0;
                    const releaseDate = release.actualReleaseDate || release.plannedReleaseDate || '';
                    const formattedDate = formatDate(releaseDate);
                    const completionPercentage = getFeatureCompletionPercentage(release);
                    
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
                          
                          <div className="flex flex-wrap gap-1 mt-2 mb-3">
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
                            
                            <Badge variant="outline" className="border-blue-300 text-blue-500">{release.type}</Badge>
                          </div>
                          
                          {/* Progress bar for feature completion */}
                          {release.features.length > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Feature completion</span>
                                <span>{completionPercentage}%</span>
                              </div>
                              <Progress value={completionPercentage} className="h-2" />
                            </div>
                          )}
                          
                          {release.description && (
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{release.description}</p>
                          )}
                          
                          {/* Release metadata */}
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                            {release.team && release.team.length > 0 && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{release.team.length} team members</span>
                              </div>
                            )}
                            
                            {release.tags && release.tags.length > 0 && (
                              <div className="flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                <span>{release.tags.length} tags</span>
                              </div>
                            )}
                            
                            {release.releaseBranch && (
                              <div className="flex items-center">
                                <GitBranch className="h-3 w-3 mr-1" />
                                <span className="truncate">{release.releaseBranch}</span>
                              </div>
                            )}
                            
                            {(release.previousVersion || release.nextVersion) && (
                              <div className="flex items-center">
                                {release.previousVersion && (
                                  <span className="flex items-center">
                                    <ArrowLeft className="h-3 w-3" />
                                    {release.previousVersion}
                                  </span>
                                )}
                                {release.previousVersion && release.nextVersion && (
                                  <span className="mx-1">|</span>
                                )}
                                {release.nextVersion && (
                                  <span className="flex items-center">
                                    {release.nextVersion}
                                    <ArrowRight className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
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
