
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit 
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Release, 
  ReleaseProgress, 
  ReleaseSortField, 
  ReleaseSortOrder 
} from '../types/releaseTypes';

interface ReleaseListProps {
  releases: Release[];
  sortField: ReleaseSortField;
  sortOrder: ReleaseSortOrder;
  filterStatus: string;
  onSelectRelease: (release: Release) => void;
  releaseProgress: ReleaseProgress[];
}

const ReleasesList: React.FC<ReleaseListProps> = ({
  releases,
  sortField,
  sortOrder,
  filterStatus,
  onSelectRelease,
  releaseProgress
}) => {
  // Filter releases by status if a filter is selected
  const filteredReleases = filterStatus === 'all' 
    ? releases 
    : releases.filter(release => release.status === filterStatus);
  
  // Sort releases according to the selected field and order
  const sortedReleases = [...filteredReleases].sort((a, b) => {
    let comparisonA;
    let comparisonB;
    
    switch (sortField) {
      case 'version':
        // Simple string comparison for version
        comparisonA = a.version;
        comparisonB = b.version;
        break;
      case 'name':
        comparisonA = a.name;
        comparisonB = b.name;
        break;
      case 'status':
        comparisonA = a.status;
        comparisonB = b.status;
        break;
      case 'plannedReleaseDate':
        comparisonA = a.plannedReleaseDate || '';
        comparisonB = b.plannedReleaseDate || '';
        break;
      default:
        comparisonA = a.plannedReleaseDate || '';
        comparisonB = b.plannedReleaseDate || '';
    }
    
    if (sortOrder === 'asc') {
      return comparisonA.localeCompare(comparisonB);
    } else {
      return comparisonB.localeCompare(comparisonA);
    }
  });
  
  const getProgressForRelease = (releaseId: string): ReleaseProgress | undefined => {
    return releaseProgress.find(progress => progress.id === releaseId);
  };
  
  // Function to render the status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    let variant = "secondary";
    
    switch (status) {
      case 'planned':
        variant = "secondary";
        break;
      case 'in_development':
        variant = "warning";
        break;
      case 'ready_for_qa':
        variant = "info";
        break;
      case 'in_qa':
        variant = "info";
        break;
      case 'ready_for_release':
        variant = "success";
        break;
      case 'released':
        variant = "success";
        break;
      default:
        variant = "secondary";
    }
    
    return (
      <Badge variant={variant as any} className="capitalize">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  if (filteredReleases.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">No releases found matching your criteria.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Version</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Release Date</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedReleases.map(release => {
          const progress = getProgressForRelease(release.id);
          
          return (
            <TableRow key={release.id}>
              <TableCell className="font-mono">{release.version}</TableCell>
              <TableCell className="font-medium">{release.name}</TableCell>
              <TableCell>
                {renderStatusBadge(release.status)}
              </TableCell>
              <TableCell>
                {release.plannedReleaseDate ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {release.plannedReleaseDate}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Unscheduled</span>
                )}
              </TableCell>
              <TableCell>
                <div className="w-full space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span>{progress?.completedFeatures || 0} / {progress?.totalFeatures || 0} features</span>
                    <span>{progress?.percentComplete || 0}%</span>
                  </div>
                  <Progress value={progress?.percentComplete || 0} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSelectRelease(release)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReleasesList;
