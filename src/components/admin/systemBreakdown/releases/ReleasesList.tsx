
import React, { useState } from 'react';
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
  Package, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown,
  Trash,
  Calendar,
  Users,
  Tag
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Release, ReleaseStatus, ReleaseSortField, ReleaseSortOrder, ReleaseType } from '../types/releaseTypes';

interface ReleasesListProps {
  releases: Release[];
  selectedReleaseId: string | null;
  sortField: ReleaseSortField;
  sortOrder: ReleaseSortOrder;
  filterStatus: ReleaseStatus | 'all';
  onSelectRelease: (id: string) => void;
  onSortChange: (field: ReleaseSortField) => void;
  onFilterChange: (status: ReleaseStatus | 'all') => void;
  onCreateRelease: (release: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteRelease: (id: string) => void;
  getNextVersionNumber: (type: ReleaseType) => string;
  formatDate: (dateString?: string) => string;
}

const ReleasesList: React.FC<ReleasesListProps> = ({
  releases,
  selectedReleaseId,
  sortField,
  sortOrder,
  filterStatus,
  onSelectRelease,
  onSortChange,
  onFilterChange,
  onCreateRelease,
  onDeleteRelease,
  getNextVersionNumber,
  formatDate
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRelease, setNewRelease] = useState({
    version: '',
    name: '',
    type: 'minor' as ReleaseType,
    status: 'planned' as ReleaseStatus,
    plannedReleaseDate: '',
    description: '',
    features: [],
    releaseNotes: [],
    team: [] as string[],
    tags: [] as string[]
  });
  const [tagsInput, setTagsInput] = useState('');
  const [teamInput, setTeamInput] = useState('');

  const handleReleaseTypeChange = (type: ReleaseType) => {
    const nextVersion = getNextVersionNumber(type);
    setNewRelease({ ...newRelease, type, version: nextVersion });
  };

  const handleCreateRelease = () => {
    // Process tags and team inputs
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const team = teamInput.split(',').map(member => member.trim()).filter(member => member);
    
    onCreateRelease({
      ...newRelease,
      tags,
      team
    });
    
    setIsCreateDialogOpen(false);
    setNewRelease({
      version: '',
      name: '',
      type: 'minor' as ReleaseType,
      status: 'planned' as ReleaseStatus,
      plannedReleaseDate: '',
      description: '',
      features: [],
      releaseNotes: [],
      team: [],
      tags: []
    });
    setTagsInput('');
    setTeamInput('');
  };

  const renderStatusBadge = (status: ReleaseStatus) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Planned</Badge>;
      case 'in_development':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Development</Badge>;
      case 'ready_for_qa':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Ready for QA</Badge>;
      case 'in_qa':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">In QA</Badge>;
      case 'ready_for_release':
        return <Badge variant="outline" className="border-green-500 text-green-500">Ready for Release</Badge>;
      case 'released':
        return <Badge className="bg-green-500">Released</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderTypeBadge = (type: ReleaseType) => {
    switch (type) {
      case 'major':
        return <Badge variant="outline" className="border-red-500 text-red-500">Major</Badge>;
      case 'minor':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Minor</Badge>;
      case 'patch':
        return <Badge variant="outline" className="border-green-500 text-green-500">Patch</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Calculate release progress percentage
  const getFeatureCompletionPercentage = (release: Release) => {
    const totalFeatures = release.features.length;
    if (totalFeatures === 0) return 100;
    
    const completedFeatures = release.features.filter(f => f.status === 'completed').length;
    return Math.round((completedFeatures / totalFeatures) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Label>Filter by status:</Label>
          <Select value={filterStatus} onValueChange={(value) => onFilterChange(value as ReleaseStatus | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
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
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Release
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Release</DialogTitle>
              <DialogDescription>
                Define the details for the new software release.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Release Type</Label>
                  <Select 
                    value={newRelease.type} 
                    onValueChange={(value) => handleReleaseTypeChange(value as ReleaseType)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="version">Version Number</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 px-1"
                            onClick={() => setNewRelease({
                              ...newRelease, 
                              version: getNextVersionNumber(newRelease.type)
                            })}
                          >
                            Auto-generate
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Generate next version number based on type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input 
                    id="version" 
                    placeholder="e.g., 1.2.0" 
                    value={newRelease.version}
                    onChange={(e) => setNewRelease({...newRelease, version: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Release Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Summer 2025 Update" 
                  value={newRelease.name}
                  onChange={(e) => setNewRelease({...newRelease, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plannedDate">Planned Release Date</Label>
                  <Input 
                    id="plannedDate" 
                    type="date" 
                    value={newRelease.plannedReleaseDate}
                    onChange={(e) => setNewRelease({...newRelease, plannedReleaseDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select 
                    value={newRelease.status} 
                    onValueChange={(value) => setNewRelease({...newRelease, status: value as ReleaseStatus})}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_development">In Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of this release"
                  value={newRelease.description}
                  onChange={(e) => setNewRelease({...newRelease, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="team">Team Members (comma separated)</Label>
                  <Input 
                    id="team" 
                    placeholder="e.g., John Doe, Jane Smith" 
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    placeholder="e.g., ui, performance, bugfix" 
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleCreateRelease}
                disabled={!newRelease.version || !newRelease.name}
              >
                Create Release
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-semibold -ml-2 h-8 hover:bg-transparent"
                  onClick={() => onSortChange('version')}
                >
                  Version
                  {sortField === 'version' ? (
                    sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-semibold -ml-2 h-8 hover:bg-transparent"
                  onClick={() => onSortChange('name')}
                >
                  Name
                  {sortField === 'name' ? (
                    sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-semibold -ml-2 h-8 hover:bg-transparent"
                  onClick={() => onSortChange('status')}
                >
                  Status
                  {sortField === 'status' ? (
                    sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-semibold -ml-2 h-8 hover:bg-transparent"
                  onClick={() => onSortChange('plannedReleaseDate')}
                >
                  Release Date
                  {sortField === 'plannedReleaseDate' ? (
                    sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Features</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No releases available</p>
                    <p className="text-sm text-gray-400">Create a new release to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              releases.map((release) => {
                const completionPercentage = getFeatureCompletionPercentage(release);
                
                return (
                  <TableRow 
                    key={release.id}
                    className={selectedReleaseId === release.id ? "bg-blue-50" : ""}
                    onClick={() => onSelectRelease(release.id)}
                  >
                    <TableCell className="font-mono font-medium">{release.version}</TableCell>
                    <TableCell>
                      <div>
                        <div>{release.name}</div>
                        {release.tags && release.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {release.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs py-0">
                                {tag}
                              </Badge>
                            ))}
                            {release.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs py-0">
                                +{release.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{renderTypeBadge(release.type)}</TableCell>
                    <TableCell>{renderStatusBadge(release.status)}</TableCell>
                    <TableCell>
                      {release.status === 'released' && release.actualReleaseDate ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-green-600" />
                          {formatDate(release.actualReleaseDate)}
                        </div>
                      ) : release.plannedReleaseDate ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(release.plannedReleaseDate)}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {release.features.length > 0 ? (
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{completionPercentage}%</span>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No features</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{release.features.length}</Badge>
                        {release.team && release.team.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="ml-1 text-xs">{release.team.length}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Team: {release.team.join(', ')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Release</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete release {release.version} - {release.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteRelease(release.id);
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReleasesList;
