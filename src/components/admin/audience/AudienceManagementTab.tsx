import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Filter, Download, BarChart3 } from 'lucide-react';
import AudienceSegmentForm from './AudienceSegmentForm';
import AudienceInsights from './AudienceInsights';
import { AudienceSegment } from '@/types/AudienceTypes';

const AudienceManagementTab = () => {
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSegmentCreated = (newSegment: AudienceSegment) => {
    setSegments([...segments, newSegment]);
    setIsCreating(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredSegments = segments.filter(segment => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(segment.name) || searchRegex.test(segment.description || '');
    const matchesStatus = statusFilter === 'all' || segment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Audience Management</CardTitle>
        <Button onClick={handleCreateClick} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {isCreating ? (
        <AudienceSegmentForm onCancel={handleCancelCreate} onSegmentCreated={handleSegmentCreated} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Segments</CardTitle>
              <CardDescription>Manage and analyze your audience segments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  type="search"
                  placeholder="Search segments..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredSegments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No segments found.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSegments.map(segment => (
                    <Card key={segment.id}>
                      <CardHeader>
                        <CardTitle>{segment.name}</CardTitle>
                        <CardDescription>{segment.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{segment.memberCount} members</span>
                        </div>
                        <Badge variant={segment.status === 'active' ? 'outline' : 'secondary'}>
                          {segment.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <AudienceInsights />
        </>
      )}
    </div>
  );
};

export default AudienceManagementTab;
